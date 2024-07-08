from django.urls import path
from . import views

app_name = 'account'

urlpatterns = [
    path('auth/register', views.RegisterView.as_view(), name='signup'),
    path('auth/login', views.LoginView.as_view(), name='login'),
    path('auth/refresh-token', views.CookieTokenRefreshView.as_view(), name='refresh-token'),
    path('auth/logout', views.LogoutView.as_view(), name='logout'),
    path('auth/user', views.UserView.as_view(), name='user'),

    path('profile/personal', views.CreateListPersonalDetails.as_view(), name='personal-details'),
    path('profile/social', views.CreateListSocialProfile.as_view(), name='personal-details')

]