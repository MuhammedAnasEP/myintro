from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ParseError
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware import csrf

from .serializers import RegistrationSerializer, LoginSerializer, UserSerializer, PersonalDetailsSerialzer, SocialProfileSerializer
from .models import User, SocialProfile

# Create your views here.

def get_user_tokens(user):
    """
    Generates user tokens for authentication.
    """
    refresh = tokens.RefreshToken.for_user(user)
    return {
        "refresh_token": str(refresh),
        "access_token": str(refresh.access_token)
    }

class RegisterView(APIView):
    def post(self, request):
        """
        Handles the POST request for user registration.
        First check the data using serializer. If the data is valid, save the user and return the response.
        If the data is not valid, return the error message.
        """
        serializer = RegistrationSerializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            if user is not None:
                return Response({'status':'Registered', 'data':serializer.data}, status=status.HTTP_201_CREATED)
                        
        return Response({'detail': 'Invalid Credentials!'}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        """
        Handles the POST request for user login.
        First check the data using serializer. If the data is valid, authenticate the user.
        If the user is authenticated, generate access and refresh tokens and return them in the response.
        """
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):        
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)

        if user is not None:
            tokens = get_user_tokens(user)
            res = Response()
            res.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=tokens['access_token'],
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            res.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=tokens['refresh_token'],
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            
            res.data = tokens
            res['X-CSRFToken'] = csrf.get_token(request)
            return res
        
        return Response({'detail': 'Invalid Credentials!'}, status=status.HTTP_401_UNAUTHORIZED)


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None
    def validate(self, attrs):
        """ Validates the attributes of the serializer. """
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken(
                'No valid token found in cookie \'refresh\'')


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        """
        Finalize the response by setting the 'refresh' cookie if it exists in the response data.
        If the 'refresh' cookie exists, it is set in the response with the appropriate expiration time,
        secure, httponly, and samesite attributes. The 'refresh' key is then deleted from the response data.
        The 'X-CSRFToken' header is set to the value of the 'csrftoken' cookie.
        """
        if response.data.get("refresh"):
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=response.data['refresh'],
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            del response.data["refresh"]
        response["X-CSRFToken"] = request.COOKIES.get("csrftoken")
        return super().finalize_response(request, response, *args, **kwargs)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        """
        This function is responsible for handling the POST request to logout the user. 
        It first retrieves the refresh token from the request cookies. Then it creates a `RefreshToken` object using the retrieved refresh token.
        After that, it blacklists the token by calling the `blacklist()` method.
        Next, it creates a `Response` object and deletes the authentication and refresh token cookies from the response. It also deletes the `X-CSRFToken` and `csrftoken` cookies. 
        Finally, it sets the `X-CSRFToken` header in the response to `None`.
        """
        try:
            refreshToken = request.COOKIES.get(
                settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            token = tokens.RefreshToken(refreshToken)
            token.blacklist()

            res = Response()
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            res.delete_cookie("X-CSRFToken")
            res.delete_cookie("csrftoken")
            res["X-CSRFToken"]=None           
            return res
        
        except:
            raise ParseError("Invalid token")

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieves the user information for the authenticated user.
        """
        try:
            user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return Response(status_code=404)

        serializer = UserSerializer(user)
        return Response(serializer.data)
    

class CreateListPersonalDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            personal_details = User.objects.get(id = request.user.id)
        except User.DoesNotExist:
            return Response(status_code=404)
        serializer = PersonalDetailsSerialzer(personal_details)
        return Response(serializer.data)
        
    def put(self, request):
        try:
            profile = User.objects.get(id = request.user.id)
        except User.DoesNotExist:
            return Response(status_code=404)
        serializer = PersonalDetailsSerialzer(profile, data=request.data)
        
        if serializer.is_valid(raise_exception = True):
            profile = serializer.save()
            if profile is not None:
                return Response({'status':'Updated', 'data':serializer.data}, status=status.HTTP_201_CREATED)
                        
        return Response({'detail': 'Invalid Credentials!'}, status=status.HTTP_400_BAD_REQUEST)

        
class CreateListSocialProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = User.objects.get(id = request.user.id)
            social_profile = SocialProfile.objects.get(user = user)
        except SocialProfile.DoesNotExist:
            return Response(status_code=404)
        
        serializer = SocialProfileSerializer(social_profile)
        return Response(serializer.data)
    
    def put(self, request):
        try:
            user = User.objects.get(id = request.user.id)
            social_profile = SocialProfile.objects.get(user = user)
        except SocialProfile.DoesNotExist:
            return Response(status_code=404)
        
        serializer = SocialProfile(social_profile, data = request.data)
        if serializer.is_valid(raise_exception = True):
            profile = serializer.save()
            if profile is not None:
                return Response({'status':'Updated', 'data':serializer.data}, status=status.HTTP_201_CREATED)
                        
        return Response({'detail': 'Invalid Credentials!'}, status=status.HTTP_400_BAD_REQUEST)