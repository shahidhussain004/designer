"""Apache Beam Transforms for Blog Aggregation"""
import apache_beam as beam
import feedparser
import hashlib
import json
import re
import os
from datetime import datetime
from typing import Dict, Any, List


class FetchRSSFeed(beam.DoFn):
    """Fetch and parse RSS feed"""
    
    def process(self, feed_url: str):
        try:
            feed = feedparser.parse(feed_url)
            
            if feed.bozo:  # Parse error
                print(f"⚠️ Error parsing {feed_url}: {feed.bozo_exception}")
                return
            
            for entry in feed.entries[:20]:  # Limit to 20 latest
                yield {
                    'source_url': feed_url,
                    'source_name': feed.feed.get('title', 'Unknown'),
                    'title': entry.get('title', ''),
                    'link': entry.get('link', ''),
                    'summary': entry.get('summary', ''),
                    'content': self._extract_content(entry),
                    'published': entry.get('published', ''),
                    'author': entry.get('author', ''),
                    'categories': [tag.term for tag in entry.get('tags', [])],
                    'media_url': self._extract_media(entry),
                    'fetched_at': datetime.utcnow().isoformat()
                }
        except Exception as e:
            print(f"❌ Error fetching {feed_url}: {e}")
    
    def _extract_content(self, entry) -> str:
        """Extract full content if available"""
        if 'content' in entry and entry['content']:
            return entry['content'][0].get('value', '')
        return entry.get('summary', '')
    
    def _extract_media(self, entry) -> str:
        """Extract media URL from entry"""
        # Check for media:thumbnail
        if 'media_thumbnail' in entry and entry['media_thumbnail']:
            return entry['media_thumbnail'][0].get('url', '')
        # Check for enclosures
        if 'enclosures' in entry and entry['enclosures']:
            for enc in entry['enclosures']:
                if enc.get('type', '').startswith('image/'):
                    return enc.get('url', '')
        return ''


class DeduplicateArticles(beam.DoFn):
    """Remove duplicate articles based on URL hash"""
    
    def __init__(self):
        self.seen_hashes = set()
    
    def process(self, article: Dict[str, Any]):
        article_hash = hashlib.md5(article['link'].encode()).hexdigest()
        
        if article_hash not in self.seen_hashes:
            self.seen_hashes.add(article_hash)
            article['article_hash'] = article_hash
            yield article


class CleanAndNormalize(beam.DoFn):
    """Clean HTML tags and normalize text"""
    
    def process(self, article: Dict[str, Any]):
        # Remove HTML tags from summary
        clean_summary = re.sub(r'<[^>]+>', '', article['summary'])
        clean_summary = re.sub(r'\s+', ' ', clean_summary).strip()
        
        # Clean content
        clean_content = re.sub(r'<[^>]+>', '', article.get('content', ''))
        clean_content = re.sub(r'\s+', ' ', clean_content).strip()
        
        article['summary_clean'] = clean_summary[:500]  # Limit to 500 chars
        article['content_clean'] = clean_content[:5000]  # Limit to 5000 chars
        article['title_clean'] = article['title'].strip()
        
        # Parse published date - try multiple formats
        article['published_parsed'] = self._parse_date(article.get('published', ''))
        
        yield article
    
    def _parse_date(self, date_str: str):
        """Try multiple date formats"""
        if not date_str:
            return None
        
        formats = [
            '%Y-%m-%dT%H:%M:%S',
            '%Y-%m-%dT%H:%M:%SZ',
            '%Y-%m-%dT%H:%M:%S%z',
            '%a, %d %b %Y %H:%M:%S %z',
            '%a, %d %b %Y %H:%M:%S GMT',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d',
        ]
        
        for fmt in formats:
            try:
                parsed = datetime.strptime(date_str[:30].strip(), fmt)
                return parsed.isoformat()
            except ValueError:
                continue
        
        return None


class ExtractKeywords(beam.DoFn):
    """Extract keywords from title and summary"""
    
    TECH_KEYWORDS = {
        'react', 'vue', 'angular', 'javascript', 'typescript', 'python', 'java',
        'spring', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'design',
        'ux', 'ui', 'frontend', 'backend', 'devops', 'security', 'api',
        'rest', 'graphql', 'mongodb', 'postgresql', 'redis', 'kafka'
    }
    
    def process(self, article: Dict[str, Any]):
        text = (article['title_clean'] + ' ' + article['summary_clean']).lower()
        
        keywords = []
        for keyword in self.TECH_KEYWORDS:
            if keyword in text:
                keywords.append(keyword)
        
        article['keywords'] = keywords
        yield article


class FormatForDatabase(beam.DoFn):
    """Format article for database insertion"""
    
    def process(self, article: Dict[str, Any]):
        yield {
            'title': article['title_clean'][:255],
            'url': article['link'],
            'summary': article['summary_clean'],
            'content': article.get('content_clean', ''),
            'author': article.get('author', '')[:100],
            'source_name': article.get('source_name', '')[:100],
            'media_url': article.get('media_url', ''),
            'published_at': article.get('published_parsed'),
            'source_url': article['source_url'],
            'keywords': ','.join(article.get('keywords', [])),
            'categories': ','.join(article.get('categories', [])[:5]),
            'article_hash': article['article_hash'],
            'created_at': datetime.utcnow().isoformat()
        }


class WriteToPostgreSQL(beam.DoFn):
    """Write articles to PostgreSQL database"""
    
    def __init__(self, connection_string: str = None):
        self.connection_string = connection_string or os.environ.get('DATABASE_URL')
        self.conn = None
    
    def setup(self):
        """Initialize database connection"""
        import psycopg2
        if self.connection_string:
            self.conn = psycopg2.connect(self.connection_string)
            self._ensure_table_exists()
    
    def _ensure_table_exists(self):
        """Create articles table if it doesn't exist"""
        if not self.conn:
            return
        
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS aggregated_blog_articles (
                id SERIAL PRIMARY KEY,
                article_hash VARCHAR(32) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                url TEXT NOT NULL,
                summary TEXT,
                content TEXT,
                author VARCHAR(100),
                source_name VARCHAR(100),
                source_url TEXT,
                media_url TEXT,
                keywords TEXT,
                categories TEXT,
                published_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_articles_hash ON aggregated_blog_articles(article_hash);
            CREATE INDEX IF NOT EXISTS idx_articles_published ON aggregated_blog_articles(published_at);
            CREATE INDEX IF NOT EXISTS idx_articles_source ON aggregated_blog_articles(source_name);
        ''')
        self.conn.commit()
        cursor.close()
    
    def process(self, article: Dict[str, Any]):
        if not self.conn:
            print(f"📝 Would insert: {article['title'][:50]}...")
            yield article
            return
        
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT INTO aggregated_blog_articles 
                (article_hash, title, url, summary, content, author, source_name, source_url, 
                 media_url, keywords, categories, published_at, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (article_hash) DO UPDATE SET
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id
            ''', (
                article['article_hash'],
                article['title'],
                article['url'],
                article['summary'],
                article.get('content', ''),
                article['author'],
                article.get('source_name', ''),
                article['source_url'],
                article.get('media_url', ''),
                article['keywords'],
                article['categories'],
                article['published_at'],
                article['created_at']
            ))
            self.conn.commit()
            cursor.close()
            yield article
        except Exception as e:
            print(f"❌ Error inserting article: {e}")
            if self.conn:
                self.conn.rollback()
    
    def teardown(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()


class ContentDeduplicator(beam.DoFn):
    """More sophisticated deduplication using content similarity"""
    
    def __init__(self):
        self.seen_hashes = set()
        self.seen_titles = {}
    
    def process(self, article: Dict[str, Any]):
        # Hash-based deduplication on URL
        url_hash = hashlib.md5(article['link'].encode()).hexdigest()
        
        if url_hash in self.seen_hashes:
            return
        
        # Title similarity check (detect reposts/syndication)
        title_normalized = re.sub(r'[^\w\s]', '', article['title'].lower())
        title_words = set(title_normalized.split())
        
        for seen_title, seen_hash in self.seen_titles.items():
            seen_words = set(seen_title.split())
            # Check if titles are 80% similar
            if len(title_words & seen_words) / max(len(title_words | seen_words), 1) > 0.8:
                return
        
        self.seen_hashes.add(url_hash)
        self.seen_titles[title_normalized] = url_hash
        article['article_hash'] = url_hash
        yield article
