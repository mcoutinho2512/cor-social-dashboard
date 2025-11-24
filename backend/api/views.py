from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Max, Q
from django.utils import timezone
from datetime import timedelta, datetime
from .models import SocialMetric, AppDownload, WebsiteMetric, ManualEntry
from .serializers import (
    SocialMetricSerializer, AppDownloadSerializer,
    WebsiteMetricSerializer, ManualEntrySerializer,
    DashboardSummarySerializer
)


class SocialMetricViewSet(viewsets.ModelViewSet):
    """ViewSet para métricas de redes sociais"""
    
    queryset = SocialMetric.objects.all()
    serializer_class = SocialMetricSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros
        platform = self.request.query_params.get('platform', None)
        period = self.request.query_params.get('period', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if platform:
            queryset = queryset.filter(platform=platform)
        
        if period:
            queryset = self._filter_by_period(queryset, period)
        
        if start_date and end_date:
            try:
                start = datetime.fromisoformat(start_date)
                end = datetime.fromisoformat(end_date)
                queryset = queryset.filter(collected_at__range=[start, end])
            except ValueError:
                pass
        
        return queryset
    
    def _filter_by_period(self, queryset, period):
        now = timezone.now()
        
        if period == 'day':
            start_date = now - timedelta(days=1)
        elif period == 'week':
            start_date = now - timedelta(weeks=1)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        elif period == 'year':
            start_date = now - timedelta(days=365)
        else:
            return queryset
        
        return queryset.filter(collected_at__gte=start_date)
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Retorna as métricas mais recentes de cada plataforma"""
        platforms = ['twitter', 'facebook', 'instagram', 'youtube', 'threads']
        latest_metrics = []
        
        for platform in platforms:
            metric = self.queryset.filter(platform=platform).first()
            if metric:
                latest_metrics.append(metric)
        
        serializer = self.get_serializer(latest_metrics, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def comparison(self, request):
        """Compara métricas entre diferentes períodos"""
        platform = request.query_params.get('platform')
        period = request.query_params.get('period', 'week')
        
        if not platform:
            return Response(
                {'error': 'Platform parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        now = timezone.now()
        
        # Define períodos
        if period == 'day':
            current_start = now - timedelta(days=1)
            previous_start = now - timedelta(days=2)
            previous_end = now - timedelta(days=1)
        elif period == 'week':
            current_start = now - timedelta(weeks=1)
            previous_start = now - timedelta(weeks=2)
            previous_end = now - timedelta(weeks=1)
        elif period == 'month':
            current_start = now - timedelta(days=30)
            previous_start = now - timedelta(days=60)
            previous_end = now - timedelta(days=30)
        else:
            current_start = now - timedelta(days=365)
            previous_start = now - timedelta(days=730)
            previous_end = now - timedelta(days=365)
        
        # Busca dados
        current_metrics = self.queryset.filter(
            platform=platform,
            collected_at__gte=current_start
        )
        
        previous_metrics = self.queryset.filter(
            platform=platform,
            collected_at__range=[previous_start, previous_end]
        )
        
        # Calcula médias
        current_avg = current_metrics.aggregate(
            avg_followers=Sum('followers')
        )
        
        previous_avg = previous_metrics.aggregate(
            avg_followers=Sum('followers')
        )
        
        return Response({
            'platform': platform,
            'period': period,
            'current': current_avg,
            'previous': previous_avg,
            'growth': self._calculate_growth(
                current_avg.get('avg_followers', 0),
                previous_avg.get('avg_followers', 0)
            )
        })
    
    def _calculate_growth(self, current, previous):
        if previous == 0:
            return 0
        return ((current - previous) / previous) * 100


class AppDownloadViewSet(viewsets.ModelViewSet):
    """ViewSet para métricas de downloads de apps"""
    
    queryset = AppDownload.objects.all()
    serializer_class = AppDownloadSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        platform = self.request.query_params.get('platform', None)
        period = self.request.query_params.get('period', None)
        
        if platform:
            queryset = queryset.filter(platform=platform)
        
        if period:
            queryset = self._filter_by_period(queryset, period)
        
        return queryset
    
    def _filter_by_period(self, queryset, period):
        now = timezone.now()
        
        if period == 'day':
            start_date = now - timedelta(days=1)
        elif period == 'week':
            start_date = now - timedelta(weeks=1)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        elif period == 'year':
            start_date = now - timedelta(days=365)
        else:
            return queryset
        
        return queryset.filter(collected_at__gte=start_date)
    
    @action(detail=False, methods=['get'])
    def total(self, request):
        """Retorna total de downloads de todas as plataformas"""
        android_total = self.queryset.filter(platform='android').aggregate(
            total=Max('total_downloads')
        )['total'] or 0
        
        ios_total = self.queryset.filter(platform='ios').aggregate(
            total=Max('total_downloads')
        )['total'] or 0
        
        return Response({
            'android': android_total,
            'ios': ios_total,
            'total': android_total + ios_total
        })


class WebsiteMetricViewSet(viewsets.ModelViewSet):
    """ViewSet para métricas do website"""
    
    queryset = WebsiteMetric.objects.all()
    serializer_class = WebsiteMetricSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        period = self.request.query_params.get('period', None)
        
        if period:
            queryset = self._filter_by_period(queryset, period)
        
        return queryset
    
    def _filter_by_period(self, queryset, period):
        now = timezone.now()
        
        if period == 'day':
            start_date = now - timedelta(days=1)
        elif period == 'week':
            start_date = now - timedelta(weeks=1)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        elif period == 'year':
            start_date = now - timedelta(days=365)
        else:
            return queryset
        
        return queryset.filter(collected_at__gte=start_date)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Retorna resumo das métricas do website"""
        period = request.query_params.get('period', 'month')
        queryset = self._filter_by_period(self.queryset, period)
        
        summary = queryset.aggregate(
            total_page_views=Sum('page_views'),
            total_unique_visitors=Sum('unique_visitors'),
            total_sessions=Sum('sessions')
        )
        
        return Response(summary)


class ManualEntryViewSet(viewsets.ModelViewSet):
    """ViewSet para entradas manuais"""
    
    queryset = ManualEntry.objects.all()
    serializer_class = ManualEntrySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        platform = self.request.query_params.get('platform', None)
        
        if platform:
            queryset = queryset.filter(platform=platform)
        
        return queryset


class DashboardViewSet(viewsets.ViewSet):
    """ViewSet para dados consolidados do dashboard"""
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Retorna resumo completo do dashboard"""
        period = request.query_params.get('period', 'month')
        
        # Métricas de redes sociais (mais recentes)
        social_platforms = ['twitter', 'facebook', 'instagram', 'youtube', 'threads']
        social_metrics = []
        total_followers = 0
        
        for platform in social_platforms:
            metric = SocialMetric.objects.filter(platform=platform).first()
            if metric:
                social_metrics.append(metric)
                total_followers += metric.followers
        
        # Downloads de apps
        android_downloads = AppDownload.objects.filter(platform='android').first()
        ios_downloads = AppDownload.objects.filter(platform='ios').first()
        
        app_downloads = [d for d in [android_downloads, ios_downloads] if d]
        total_app_downloads = sum([d.total_downloads for d in app_downloads])
        
        # Métricas do website
        now = timezone.now()
        if period == 'day':
            start_date = now - timedelta(days=1)
        elif period == 'week':
            start_date = now - timedelta(weeks=1)
        elif period == 'year':
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=30)
        
        website_metrics = WebsiteMetric.objects.filter(
            collected_at__gte=start_date
        )
        
        total_page_views = website_metrics.aggregate(
            total=Sum('page_views')
        )['total'] or 0
        
        return Response({
            'social_metrics': SocialMetricSerializer(social_metrics, many=True).data,
            'app_downloads': AppDownloadSerializer(app_downloads, many=True).data,
            'website_metrics': WebsiteMetricSerializer(website_metrics, many=True).data,
            'total_followers': total_followers,
            'total_app_downloads': total_app_downloads,
            'total_page_views': total_page_views,
            'period': period
        })
