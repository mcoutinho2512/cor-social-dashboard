from rest_framework import serializers
from .models import SocialMetric, AppDownload, WebsiteMetric, ManualEntry


class SocialMetricSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = SocialMetric
        fields = [
            'id', 'platform', 'platform_display', 'followers', 'following',
            'posts_count', 'engagement_rate', 'likes', 'comments', 'shares',
            'views', 'collected_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AppDownloadSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = AppDownload
        fields = [
            'id', 'platform', 'platform_display', 'total_downloads',
            'daily_downloads', 'weekly_downloads', 'monthly_downloads',
            'active_users', 'rating', 'reviews_count',
            'collected_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class WebsiteMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteMetric
        fields = [
            'id', 'page_views', 'unique_visitors', 'sessions',
            'bounce_rate', 'avg_session_duration', 'organic_traffic',
            'direct_traffic', 'referral_traffic', 'social_traffic',
            'collected_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ManualEntrySerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = ManualEntry
        fields = [
            'id', 'platform', 'platform_display', 'metric_name',
            'metric_value', 'notes', 'entered_by',
            'collected_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class DashboardSummarySerializer(serializers.Serializer):
    """Serializer para resumo do dashboard"""
    
    social_metrics = SocialMetricSerializer(many=True)
    app_downloads = AppDownloadSerializer(many=True)
    website_metrics = WebsiteMetricSerializer(many=True)
    
    # Totais
    total_followers = serializers.IntegerField()
    total_app_downloads = serializers.IntegerField()
    total_page_views = serializers.IntegerField()
