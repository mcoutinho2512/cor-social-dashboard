from django.contrib import admin
from .models import SocialMetric, AppDownload, WebsiteMetric, ManualEntry


@admin.register(SocialMetric)
class SocialMetricAdmin(admin.ModelAdmin):
    list_display = ['platform', 'followers', 'engagement_rate', 'collected_at']
    list_filter = ['platform', 'collected_at']
    search_fields = ['platform']
    date_hierarchy = 'collected_at'
    ordering = ['-collected_at']


@admin.register(AppDownload)
class AppDownloadAdmin(admin.ModelAdmin):
    list_display = ['platform', 'total_downloads', 'daily_downloads', 'rating', 'collected_at']
    list_filter = ['platform', 'collected_at']
    search_fields = ['platform']
    date_hierarchy = 'collected_at'
    ordering = ['-collected_at']


@admin.register(WebsiteMetric)
class WebsiteMetricAdmin(admin.ModelAdmin):
    list_display = ['page_views', 'unique_visitors', 'sessions', 'bounce_rate', 'collected_at']
    list_filter = ['collected_at']
    date_hierarchy = 'collected_at'
    ordering = ['-collected_at']


@admin.register(ManualEntry)
class ManualEntryAdmin(admin.ModelAdmin):
    list_display = ['platform', 'metric_name', 'metric_value', 'entered_by', 'collected_at']
    list_filter = ['platform', 'collected_at']
    search_fields = ['platform', 'metric_name', 'entered_by']
    date_hierarchy = 'collected_at'
    ordering = ['-collected_at']
