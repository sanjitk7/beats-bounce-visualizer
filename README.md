# [Growth & CCMP Hackathon] A New Music Visualizer 

Currently there is no music visualizer on Amazon Music - visualizers can make listening experience a more dynamic experience. The Idea is to analyze the music in realtime and simulate colorful, bouncing spheres reacting to the music's rhythm and intensity. As the music plays the spheres bounce higher, modulate their motion and color. This could serve to complement the now playing screen, a full screen party mode or standalone visualizer to increase engagement of customers who prefer visualizers. Visualizers have been historically a popular visual engagement tool for audio only mp3 tracks - if there is a modern twist and optionally available - it could help satisfy a portion of the customer base that enjoys it. This work tries to create a prototype spin off of a traditional visualizer to have a different type of graphics simulation with colored spheres bouncing to music rhythm. 

WebGL based spheres bouncing animation where initial positions are hardcoded but we simulate real movement based on dynamically programmed external forces (gravity, drag, momentum, elasticity, wall-collision). For the prototype I have an MP3 file saved locally, and use vanilla javascript AudioContext Analyzer and when the track is playing we are able to get time-local frequency data. We get this data in every animationFrame - it has a recursive handler. We just find the average of the frequencies to see if it exceeds a (currently) hard-coded threshold. If it does so then we add another new acting force on the spheres based on how much the current time slice’s frequency exceeds the threshold. The direction of this force is picked arbitrarily and applied to all spheres.

There is room for improvement here - dynamically calculating the threshold based on track’s frequency distribution, changing RGB values of the spheres based on other track metadata outside frequency (amplitude, pitch, loudness, tempo), better way to calculate magnitude and direction of the force to enact on each pulse etc.
