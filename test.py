def user_music_status(content):
    avegare_status = {
        'acousticness': 0,
        'danceability': 0,
        'energy': 0,
        'instrumentalness': 0,
        'liveness': 0,
        'loudness': 0,
        'mode': 0,
        'speechiness': 0,
        'tempo': 0,
        'valence': 0,
    }
    for key in content:
        for status in content[key]:
            if status != 'country':
                avegare_status[status] += content[key][status]
    for status in avegare_status:
        avegare_status[status] /= len(content)
        avegare_status[status] = float(f'{avegare_status[status]:.4f}')
    
    print(avegare_status)

content = {
'0MyTMrPTh0GgtuyhYRdl3P': {
    'acousticness': 0.000166, 
    'danceability': 0.436, 
    'energy': 0.896, 
    'instrumentalness': 0, 
    'liveness': 0.0757, 
    'loudness': -2.15, 
    'mode': 1, 
    'speechiness': 0.0928, 
    'tempo': 173.015, 
    'valence': 0.771, 
    'country': 'JP'
    }, 
'7IQiZVGgfW927fImwKJDOq': {
    'acousticness': 0.996, 
    'danceability': 0.567, 
    'energy': 0.0994, 
    'instrumentalness': 0.833, 
    'liveness': 0.103, 
    'loudness': -17.668, 
    'mode': 1, 
    'speechiness': 0.0578, 
    'tempo': 86.689, 
    'valence': 0.594,
    'country': 'JP'
    }, 
'1Sy41HCCozDBL73orZpW5Y': {
    'acousticness': 0.00151, 
    'danceability': 0.404, 
    'energy': 0.963, 
    'instrumentalness': 1.06e-05, 
    'liveness': 0.0521, 
    'loudness': -1.707, 
    'mode': 1, 
    'speechiness': 0.0663, 
    'tempo': 169.963, 
    'valence': 0.607, 
    'country': 'JP'
    }, 
'2ChSAhdQmJpHgos2DQP6cI': {
    'acousticness': 0.00304, 
    'danceability': 0.734, 
    'energy': 0.822, 
    'instrumentalness': 0, 
    'liveness': 0.0165, 
    'loudness': -3.397, 
    'mode': 0, 
    'speechiness': 0.0537,
    'tempo': 129.956, 
    'valence': 0.801, 
    'country': 'JP'
    }
}

user_music_status(content)