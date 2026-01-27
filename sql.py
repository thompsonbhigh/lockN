Chest = ['Smith Machine Bench Press', 
         'Dumbbell Flyes', 
         'Incline Dumbbell Press', 
         'Smith Machine Incline Bench Press', 
         'Push-Ups', 
         'Chest Dips', 
         'Pec Deck Flies', 
         'Decline Barbell Bench Press']

Quads = ['Barbell Squats', 
         'Leg Press', 
         'Lunges', 
         'Leg Extensions', 
         'Bulgarian Split Squats', 
         'Goblet Squats', 
         'Sissy Squats',
         'Smith Machine Squats',
         'Hack Squats',
         'Pendulum Squats']

Lats = ['Pull-Ups', 
        'Lat Pulldown', 
        'Seated Cable Rows',  
        'Single-Arm Dumbbell Rows', 
        'Inverted Rows', 
        'Straight-Arm Pulldown', 
        'Chest-Supported Rows']

Back = ['Deadlifts', 
        'Good Mornings', 
        'Face Pulls', 
        'Cable Rows', 
        'T-Bar Rows',
        'Barbell Rows',
        'Chest-Supported Rows',
        'Bridges']

Shoulders = ['Overhead Barbell Press', 
             'Dumbbell Lateral Raises', 
             'Front Raises', 
             'Arnold Press', 
             'Upright Rows', 
             'Reverse Pec Deck Flyes', 
             'Cable Lateral Raises',]

Biceps = ['Barbell Curls', 
          'Dumbbell Hammer Curls', 
          'Preacher Curls', 
          'Cable Curls', 
          'Chin-Ups', 
          'EZ-Bar Curls', 
          'Incline Dumbbell Curls',
          'Zottman Curls', 
          'Spider Curls']

Triceps = ['Tricep Dips', 
           'Skull Crushers', 
           'Tricep Pushdowns', 
           'Overhead Tricep Extensions', 
           'Cable Overhead Tricep Extensions', 
            'Kickbacks', 
            'Bench Dips', 
            'JM Press']

Calves = ['Standing Calf Raises', 
          'Seated Calf Raises', 
          'Donkey Calf Raises', 
          'Calf Press on Leg Press Machine', 
          'Single-Leg Calf Raises']

Abs = ['Plank', 
       'Crunches', 
       'Leg Raises', 
       'Bicycle Crunches', 
       'Russian Twists', 
       'Mountain Climbers', 
       'Hanging Leg Raises', 
       'Sit-Ups', 
       'V-Ups', 
       'Flutter Kicks',
       'Machine Crunches',
       'Cable Crunches']

Hamstrings = ['Romanian Deadlifts', 
             'Leg Curls', 
             'Glute-Ham Raises', 
             'Good Mornings', 
             'Single-Leg Deadlifts',
             'Straight-Leg Deadlifts']

with open('exercises.sql', 'w') as f:
    exercises = ['Chest', 'Quads', 'Lats', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs', 'Hamstrings']
    for muscle_group in exercises:
        for exercise in eval(muscle_group):
            f.write(f"INSERT INTO exercises (name, muscle) VALUES ('{exercise}', '{muscle_group}');\n")