from django.db import models
from django.utils import timezone


class SocialMetric(models.Model):
    """Modelo base para métricas de redes sociais"""
    
    PLATFORM_CHOICES = [
        ('twitter', 'Twitter/X'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('youtube', 'YouTube'),
        ('threads', 'Threads'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0, null=True, blank=True)
    posts_count = models.IntegerField(default=0, null=True, blank=True)
    engagement_rate = models.FloatField(default=0.0, null=True, blank=True)
    
    # Métricas de engajamento
    likes = models.IntegerField(default=0, null=True, blank=True)
    comments = models.IntegerField(default=0, null=True, blank=True)
    shares = models.IntegerField(default=0, null=True, blank=True)
    views = models.IntegerField(default=0, null=True, blank=True)
    
    # Metadados
    collected_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-collected_at']
        indexes = [
            models.Index(fields=['platform', 'collected_at']),
        ]
    
    def __str__(self):
        return f"{self.platform} - {self.followers} seguidores - {self.collected_at.strftime('%d/%m/%Y %H:%M')}"


class AppDownload(models.Model):
    """Métricas de downloads dos aplicativos"""
    
    PLATFORM_CHOICES = [
        ('android', 'Google Play'),
        ('ios', 'App Store'),
    ]
    
    platform = models.CharField(max_length=10, choices=PLATFORM_CHOICES)
    total_downloads = models.IntegerField(default=0)
    daily_downloads = models.IntegerField(default=0, null=True, blank=True)
    weekly_downloads = models.IntegerField(default=0, null=True, blank=True)
    monthly_downloads = models.IntegerField(default=0, null=True, blank=True)
    
    # Métricas adicionais
    active_users = models.IntegerField(default=0, null=True, blank=True)
    rating = models.FloatField(default=0.0, null=True, blank=True)
    reviews_count = models.IntegerField(default=0, null=True, blank=True)
    
    # Metadados
    collected_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-collected_at']
        indexes = [
            models.Index(fields=['platform', 'collected_at']),
        ]
    
    def __str__(self):
        return f"{self.platform} - {self.total_downloads} downloads - {self.collected_at.strftime('%d/%m/%Y')}"


class WebsiteMetric(models.Model):
    """Métricas de acesso ao site"""
    
    page_views = models.IntegerField(default=0)
    unique_visitors = models.IntegerField(default=0)
    sessions = models.IntegerField(default=0)
    bounce_rate = models.FloatField(default=0.0, null=True, blank=True)
    avg_session_duration = models.IntegerField(default=0, null=True, blank=True)  # em segundos
    
    # Origens de tráfego
    organic_traffic = models.IntegerField(default=0, null=True, blank=True)
    direct_traffic = models.IntegerField(default=0, null=True, blank=True)
    referral_traffic = models.IntegerField(default=0, null=True, blank=True)
    social_traffic = models.IntegerField(default=0, null=True, blank=True)
    
    # Metadados
    collected_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-collected_at']
        indexes = [
            models.Index(fields=['collected_at']),
        ]
    
    def __str__(self):
        return f"{self.page_views} visualizações - {self.collected_at.strftime('%d/%m/%Y')}"


class ManualEntry(models.Model):
    """Entradas manuais para plataformas sem API disponível"""
    
    PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('threads', 'Threads'),
        ('other', 'Outro'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    metric_name = models.CharField(max_length=100)
    metric_value = models.IntegerField()
    notes = models.TextField(blank=True, null=True)
    
    # Metadados
    entered_by = models.CharField(max_length=100)
    collected_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-collected_at']
        verbose_name_plural = "Manual entries"
    
    def __str__(self):
        return f"{self.platform} - {self.metric_name}: {self.metric_value}"
