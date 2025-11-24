from celery import shared_task
from django.conf import settings
from django.utils import timezone
from .models import SocialMetric, AppDownload, WebsiteMetric
import tweepy
import requests
from datetime import datetime, timedelta


@shared_task
def fetch_twitter_metrics():
    """Busca métricas do Twitter/X"""
    
    if not settings.TWITTER_BEARER_TOKEN:
        print("Twitter Bearer Token não configurado")
        return
    
    try:
        # Configuração do Tweepy
        client = tweepy.Client(bearer_token=settings.TWITTER_BEARER_TOKEN)
        
        # Buscar informações do usuário
        # Nota: Você precisa definir o username do COR
        username = "OperacoesRio"  # Ajustar conforme necessário
        
        user = client.get_user(
            username=username,
            user_fields=['public_metrics']
        )
        
        if user.data:
            metrics = user.data.public_metrics
            
            SocialMetric.objects.create(
                platform='twitter',
                followers=metrics.get('followers_count', 0),
                following=metrics.get('following_count', 0),
                posts_count=metrics.get('tweet_count', 0),
                collected_at=timezone.now()
            )
            
            print(f"Twitter metrics coletadas: {metrics.get('followers_count', 0)} seguidores")
        
    except Exception as e:
        print(f"Erro ao coletar métricas do Twitter: {str(e)}")


@shared_task
def fetch_youtube_metrics():
    """Busca métricas do YouTube"""
    
    if not settings.YOUTUBE_API_KEY or not settings.YOUTUBE_CHANNEL_ID:
        print("YouTube API Key ou Channel ID não configurados")
        return
    
    try:
        from googleapiclient.discovery import build
        
        youtube = build('youtube', 'v3', developerKey=settings.YOUTUBE_API_KEY)
        
        # Buscar estatísticas do canal
        request = youtube.channels().list(
            part='statistics',
            id=settings.YOUTUBE_CHANNEL_ID
        )
        
        response = request.execute()
        
        if response['items']:
            stats = response['items'][0]['statistics']
            
            SocialMetric.objects.create(
                platform='youtube',
                followers=int(stats.get('subscriberCount', 0)),
                posts_count=int(stats.get('videoCount', 0)),
                views=int(stats.get('viewCount', 0)),
                collected_at=timezone.now()
            )
            
            print(f"YouTube metrics coletadas: {stats.get('subscriberCount', 0)} inscritos")
    
    except Exception as e:
        print(f"Erro ao coletar métricas do YouTube: {str(e)}")


@shared_task
def fetch_google_play_metrics():
    """Busca métricas do Google Play"""
    
    if not settings.GOOGLE_PLAY_PACKAGE_NAME:
        print("Google Play Package Name não configurado")
        return
    
    try:
        # Esta é uma implementação simplificada
        # Em produção, você precisará usar a Google Play Developer API
        # com autenticação OAuth2
        
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        
        # Carregar credenciais
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_PLAY_SERVICE_ACCOUNT,
            scopes=['https://www.googleapis.com/auth/androidpublisher']
        )
        
        service = build('androidpublisher', 'v3', credentials=credentials)
        
        # Aqui você implementaria a lógica específica para buscar
        # estatísticas do seu app no Google Play
        # Por enquanto, vou deixar um placeholder
        
        print("Google Play metrics - implementar lógica específica")
        
    except Exception as e:
        print(f"Erro ao coletar métricas do Google Play: {str(e)}")


@shared_task
def fetch_app_store_metrics():
    """Busca métricas da App Store"""
    
    if not settings.APPLE_APP_ID:
        print("Apple App ID não configurado")
        return
    
    try:
        # App Store Connect API requer autenticação JWT
        # Esta é uma implementação simplificada
        
        import jwt
        from datetime import datetime, timedelta
        
        # Gerar JWT token
        private_key = open(settings.APPLE_PRIVATE_KEY_PATH, 'r').read()
        
        token = jwt.encode(
            {
                'iss': settings.APPLE_ISSUER_ID,
                'exp': datetime.utcnow() + timedelta(minutes=20),
                'aud': 'appstoreconnect-v1'
            },
            private_key,
            algorithm='ES256',
            headers={
                'kid': settings.APPLE_KEY_ID,
                'typ': 'JWT'
            }
        )
        
        # Fazer requisição à API
        headers = {
            'Authorization': f'Bearer {token}'
        }
        
        # Endpoint para analytics
        url = f'https://api.appstoreconnect.apple.com/v1/apps/{settings.APPLE_APP_ID}/perfPowerMetrics'
        
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            # Processar dados e salvar
            print("App Store metrics coletadas")
        else:
            print(f"Erro ao buscar dados da App Store: {response.status_code}")
    
    except Exception as e:
        print(f"Erro ao coletar métricas da App Store: {str(e)}")


@shared_task
def fetch_analytics_metrics():
    """Busca métricas do Google Analytics"""
    
    if not settings.GOOGLE_ANALYTICS_PROPERTY_ID:
        print("Google Analytics Property ID não configurado")
        return
    
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric, Dimension
        from google.oauth2 import service_account
        
        # Carregar credenciais
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_ANALYTICS_CREDENTIALS
        )
        
        client = BetaAnalyticsDataClient(credentials=credentials)
        
        # Configurar requisição
        request = RunReportRequest(
            property=f"properties/{settings.GOOGLE_ANALYTICS_PROPERTY_ID}",
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
            metrics=[
                Metric(name="screenPageViews"),
                Metric(name="activeUsers"),
                Metric(name="sessions"),
                Metric(name="bounceRate"),
            ],
            dimensions=[Dimension(name="date")],
        )
        
        response = client.run_report(request)
        
        # Processar resposta
        for row in response.rows:
            date_value = row.dimension_values[0].value
            
            WebsiteMetric.objects.create(
                page_views=int(row.metric_values[0].value),
                unique_visitors=int(row.metric_values[1].value),
                sessions=int(row.metric_values[2].value),
                bounce_rate=float(row.metric_values[3].value),
                collected_at=timezone.now()
            )
        
        print("Google Analytics metrics coletadas")
    
    except Exception as e:
        print(f"Erro ao coletar métricas do Google Analytics: {str(e)}")


@shared_task
def cleanup_old_metrics():
    """Remove métricas antigas (manter apenas últimos 2 anos)"""
    
    cutoff_date = timezone.now() - timedelta(days=730)
    
    deleted_social = SocialMetric.objects.filter(collected_at__lt=cutoff_date).delete()
    deleted_apps = AppDownload.objects.filter(collected_at__lt=cutoff_date).delete()
    deleted_website = WebsiteMetric.objects.filter(collected_at__lt=cutoff_date).delete()
    
    print(f"Limpeza concluída: {deleted_social[0]} social, {deleted_apps[0]} apps, {deleted_website[0]} website")
