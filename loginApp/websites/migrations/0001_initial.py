# Generated by Django 3.1 on 2020-08-17 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Websote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('website', models.CharField(max_length=200)),
                ('url', models.CharField(max_length=1000)),
                ('password', models.CharField(max_length=200, verbose_name='Password')),
            ],
        ),
    ]
