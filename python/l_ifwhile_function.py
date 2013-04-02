def guessNumber():
	while True:
		# ch charts and simbles is not supported
		guess = int(raw_input('you guess```'))
		if guess == 56 :
			# break will also jump over else block
			print 'lucky you!'
			break
		elif guess < 56 :
			print 'your input is lower'
		else:
			print 'your input is larger'
	else:
		print 'Done guessing```'
	# number = 23
	# running = True
	# while running:
	# 	guess = int(raw_input('Enter an integer : '))
	# 	if guess == number:
	# 		print 'Congratulations, you guessed it.'
	# 		running = False # this causes the while loop to stop
	# 	elif guess < number:
	# 		print 'No, it is a little higher than that'
	# 	else:
	# 		print 'No, it is a little lower than that'
	# else:
	# 	print 'The while loop is over.'
	# # Do anything else you want to do here
	print 'Done'
	

guessNumber()