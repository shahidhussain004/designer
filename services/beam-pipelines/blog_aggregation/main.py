"""Blog Feed Aggregation Pipeline - Main Entry Point"""
import os
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions, SetupOptions
from blog_aggregation.sources import RSS_FEEDS
from blog_aggregation.transforms import (
    FetchRSSFeed,
    ContentDeduplicator,
    CleanAndNormalize,
    ExtractKeywords,
    FormatForDatabase,
    WriteToPostgreSQL
)


class BlogAggregationOptions(PipelineOptions):
    """Custom pipeline options for blog aggregation"""
    
    @classmethod
    def _add_argparse_args(cls, parser):
        parser.add_argument(
            '--database_url',
            default=os.environ.get('DATABASE_URL', ''),
            help='PostgreSQL connection string'
        )
        parser.add_argument(
            '--output_path',
            default='output/blog_articles',
            help='Output path for JSON files (when not using database)'
        )
        parser.add_argument(
            '--use_database',
            default='false',
            help='Whether to write to PostgreSQL database'
        )


def run_pipeline(argv=None):
    """Run the blog aggregation pipeline"""
    
    pipeline_options = PipelineOptions(argv)
    blog_options = pipeline_options.view_as(BlogAggregationOptions)
    pipeline_options.view_as(SetupOptions).save_main_session = True
    
    use_database = blog_options.use_database.lower() == 'true'
    
    print(f"📰 Blog Feed Aggregation Pipeline")
    print(f"   Feeds: {len(RSS_FEEDS)}")
    print(f"   Database: {'Enabled' if use_database else 'Disabled'}")
    print("-" * 50)
    
    with beam.Pipeline(options=pipeline_options) as pipeline:
        
        # Create collection of feed URLs
        feed_urls = (
            pipeline
            | 'Create Feed URLs' >> beam.Create(RSS_FEEDS)
        )
        
        # Fetch and parse feeds
        articles = (
            feed_urls
            | 'Fetch RSS Feeds' >> beam.ParDo(FetchRSSFeed())
        )
        
        # Deduplicate articles using content similarity
        unique_articles = (
            articles
            | 'Deduplicate' >> beam.ParDo(ContentDeduplicator())
        )
        
        # Clean and normalize
        cleaned = (
            unique_articles
            | 'Clean and Normalize' >> beam.ParDo(CleanAndNormalize())
        )
        
        # Extract keywords
        with_keywords = (
            cleaned
            | 'Extract Keywords' >> beam.ParDo(ExtractKeywords())
        )
        
        # Format for database
        formatted = (
            with_keywords
            | 'Format for DB' >> beam.ParDo(FormatForDatabase())
        )
        
        # Write to database or file
        if use_database:
            formatted | 'Write to PostgreSQL' >> beam.ParDo(
                WriteToPostgreSQL(blog_options.database_url)
            )
        else:
            # Write to JSON file
            (
                formatted
                | 'Convert to JSON' >> beam.Map(lambda x: __import__('json').dumps(x))
                | 'Write Results' >> beam.io.WriteToText(
                    blog_options.output_path,
                    file_name_suffix='.json',
                    num_shards=1
                )
            )
        
        # Print stats
        (
            formatted
            | 'Count Articles' >> beam.combiners.Count.Globally()
            | 'Print Count' >> beam.Map(
                lambda count: print(f"✅ Processed {count} unique articles")
            )
        )


if __name__ == '__main__':
    import sys
    print("🚀 Starting Blog Feed Aggregation Pipeline...")
    run_pipeline(sys.argv[1:])
    print("✅ Pipeline completed successfully!")
