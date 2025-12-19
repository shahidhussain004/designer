"""Blog Feed Aggregation Pipeline - Main Entry Point"""
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from blog_aggregation.sources import RSS_FEEDS
from blog_aggregation.transforms import (
    FetchRSSFeed,
    DeduplicateArticles,
    CleanAndNormalize,
    ExtractKeywords,
    FormatForDatabase
)


def run_pipeline(argv=None):
    """Run the blog aggregation pipeline"""
    
    pipeline_options = PipelineOptions(argv)
    
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
        
        # Deduplicate articles
        unique_articles = (
            articles
            | 'Deduplicate' >> beam.ParDo(DeduplicateArticles())
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
        
        # Write to text file (for now, replace with DB write later)
        formatted | 'Write Results' >> beam.io.WriteToText(
            'output/blog_articles',
            file_name_suffix='.json',
            num_shards=1
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
