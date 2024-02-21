# class music_router:
#     """
#     A router to control database operations on models in the melotus app.
#     """

#     def db_for_read(self, model, **hints):
#         """
#         Attempts to read MusicStatus models go to 'database2' database.
#         """
#         if model._meta.app_label == 'melotus' and model._meta.model_name == 'music_status':
#             return 'database2'
#         return 'default'

#     def db_for_write(self, model, **hints):
#         """
#         Attempts to write MusicStatus models go to 'database2' database.
#         """
#         if model._meta.app_label == 'melotus' and model._meta.model_name == 'music_status':
#             return 'database2'
#         return 'default'

#     def allow_relation(self, obj1, obj2, **hints):
#         """
#         Allow relations if a model in the melotus app is involved.
#         """
#         if obj1._meta.app_label == 'melotus' or obj2._meta.app_label == 'melotus':
#             return True
#         return None

#     def allow_migrate(self, db, app_label, model_name=None, **hints):
#         """
#         Make sure the melotus app only appears in the 'database2' database.
#         """
#         if app_label == 'melotus':
#             return db == 'database2'
#         return None