# Apache Beam Data Pipelines

This directory contains Apache Beam pipelines for data processing in the Designer Marketplace platform.

## Pipelines

### 1. Blog Feed Aggregation Pipeline
- Fetches RSS feeds from 100+ sources
- Parses and deduplicates content
- Stores aggregated posts in database
- **Location**: `blog_aggregation/`

### 2. Analytics Pipeline
- Processes Kafka events
- Aggregates metrics
- Feeds data to Grafana dashboards
- **Location**: `analytics/`

### 3. ML Training Pipeline
- Extracts features from job/user data
- Generates training datasets for matching algorithm
- **Location**: `ml_training/`

### 4. GDPR Export Pipeline
- Queries all databases
- Merges user data
- Exports as JSON for compliance
- **Location**: `gdpr_export/`

## Setup

### Prerequisites
- Python 3.11+
- Apache Beam 2.50+
- Virtual environment

### Installation

```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### Running Pipelines

```bash
# Blog aggregation
python -m blog_aggregation.main --runner=DirectRunner

# Analytics
python -m analytics.main --runner=DirectRunner

# ML training
python -m ml_training.main --runner=DirectRunner
```

## Project Structure

```
beam-pipelines/
├── blog_aggregation/
│   ├── __init__.py
│   ├── main.py
│   ├── transforms.py
│   └── sources.py
├── analytics/
│   ├── __init__.py
│   ├── main.py
│   └── transforms.py
├── ml_training/
│   ├── __init__.py
│   ├── main.py
│   └── feature_extraction.py
├── gdpr_export/
│   ├── __init__.py
│   └── main.py
├── requirements.txt
└── README.md
```

## Phase 4 Status

- [ ] Blog feed aggregation (3 days)
- [ ] ML training pipeline (3 days)
- [ ] Analytics pipeline (2 days)
- [ ] GDPR export pipeline (2 days)
