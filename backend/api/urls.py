from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SocialMetricViewSet,
    AppDownloadViewSet,
    WebsiteMetricViewSet,
    ManualEntryViewSet,
    DashboardViewSet
)

router = DefaultRouter()
router.register(r'social-metrics', SocialMetricViewSet, basename='social-metric')
router.register(r'app-downloads', AppDownloadViewSet, basename='app-download')
router.register(r'website-metrics', WebsiteMetricViewSet, basename='website-metric')
router.register(r'manual-entries', ManualEntryViewSet, basename='manual-entry')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
