import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cor_dashboard.settings')

app = Celery('cor_dashboard')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Celery Beat Schedule
app.conf.beat_schedule = {
    'fetch-twitter-metrics-every-hour': {
        'task': 'api.tasks.fetch_twitter_metrics',
        'schedule': crontab(minute=0),  # A cada hora
    },
    'fetch-youtube-metrics-every-hour': {
        'task': 'api.tasks.fetch_youtube_metrics',
        'schedule': crontab(minute=5),  # A cada hora, 5 min depois
    },
    'fetch-app-store-metrics-daily': {
        'task': 'api.tasks.fetch_app_store_metrics',
        'schedule': crontab(hour=2, minute=0),  # 2h da manhã
    },
    'fetch-google-play-metrics-daily': {
        'task': 'api.tasks.fetch_google_play_metrics',
        'schedule': crontab(hour=2, minute=30),  # 2:30h da manhã
    },
    'fetch-analytics-metrics-every-6-hours': {
        'task': 'api.tasks.fetch_analytics_metrics',
        'schedule': crontab(minute=0, hour='*/6'),  # A cada 6 horas
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
