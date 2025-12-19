"""Apache Beam Transforms for Blog Aggregation"""
import apache_beam as beam
import feedparser
import hashlib
import re
from datetime import datetime
from typing import Dict, Any


class FetchRSSFeed(beam.DoFn):
    """Fetch and parse RSS feed"""
    
    def process(self, feed_url: str):
        try:
            feed = feedparser.parse(feed_url)
            
            if feed.bozo:  # Parse error
                print(f"Error parsing {feed_url}: {feed.bozo_exception}")
                return
            
            for entry in feed.entries[:20]:  # Limit to 20 latest
                yield {
                    'source_url': feed_url,
                    'title': entry.get('title', ''),
                    'link': entry.get('link', ''),
                    'summary': entry.get('summary', ''),
                    'published': entry.get('published', ''),
                    'author': entry.get('author', ''),
                    'categories': [tag.term for tag in entry.get('tags', [])],
                    'fetched_at': datetime.utcnow().isoformat()
                }
        except Exception as e:
            print(f"Error fetching {feed_url}: {e}")


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
        clean_text = re.sub(r'<[^>]+>', '', article['summary'])
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        
        article['summary_clean'] = clean_text[:500]  # Limit to 500 chars
        article['title_clean'] = article['title'].strip()
        
        # Parse published date
        try:
            if article['published']:
                article['published_parsed'] = datetime.strptime(
                    article['published'][:19], 
                    '%Y-%m-%dT%H:%M:%S'
                ).isoformat()
        except:
            article['published_parsed'] = None
        
        yield article


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
            'author': article.get('author', '')[:100],
            'published_at': article.get('published_parsed'),
            'source_url': article['source_url'],
            'keywords': ','.join(article.get('keywords', [])),
            'categories': ','.join(article.get('categories', [])[:5]),
            'article_hash': article['article_hash'],
            'created_at': datetime.utcnow().isoformat()
        }
