# Generated by Django 5.0.6 on 2024-07-07 09:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_user_location_user_phone_number_user_summary'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='title',
            field=models.CharField(default=1, max_length=300),
            preserve_default=False,
        ),
    ]
