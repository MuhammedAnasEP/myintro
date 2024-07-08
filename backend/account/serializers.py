from rest_framework import serializers
from .models import User, SocialProfile

class RegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ('email', 'password', 'confirm_password')
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True},
            }

    def create(self, validated_data):
        """
        Save the user registration data to the database.
        This method creates a new user instance based on the validated data provided.
        It checks if a user with the same email already exists in the database. 
        If it does, a `ValidationError` is raised with the message "A user with that email already exists."
        If the passwords do not match, a `ValidationError` is raised with the message "Passwords do not match!".
        """

        email=validated_data['email']
        password = validated_data['password']
        confirm_password = validated_data['confirm_password']

        if User.objects.filter(email=email):
            raise serializers.ValidationError(
                {'email': 'A user with that email already exists.'})

        if password != confirm_password:
            raise serializers.ValidationError(
                {'password': 'Passwords do not match!'})
        
        username = email.split('@')
        username = username[0].lower()
        user = User.objects.create_user(email=email, username=username, password=password)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')


class PersonalDetailsSerialzer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    full_name = serializers.CharField(max_length=300, required=False)
    phone_number = serializers.CharField(max_length=20, required=False)
    title = serializers.CharField(max_length=300, required=False)
    location = serializers.CharField(max_length=200, required=False)
    summary = serializers.CharField(required=False)

    def create(self, validated_data):
        return User.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.title = validated_data.get('title', instance.title)
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.location = validated_data.get('location', instance.location)
        instance.summary = validated_data.get('summary', instance.summary)
        instance.save()
        return instance
    
class SocialProfileSerializer(serializers.Serializer):
    x = serializers.CharField(max_length=100, required = False)
    instagram = serializers.CharField(max_length=100, required = False)
    linkedin = serializers.CharField(max_length=100, required = False)
    you_tube = serializers.CharField(max_length=100, required = False)
    
    def create(self, validate_data):
        return SocialProfile.objects.create(**validate_data)
    
    def update(self, instance, validated_data):
        instance.x = validated_data.get('x', instance.x)
        instance.instagram = validated_data.get('instagram', instance.instagram)
        instance.linkedin = validated_data.get('linkedin', instance.linkedin)
        instance.you_tube = validated_data.get('you_tube', instance.you_tube)
        instance.save()
        return instance