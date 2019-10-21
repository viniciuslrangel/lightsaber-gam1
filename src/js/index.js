const mobile = window.innerWidth / window.innerHeight < 1

if(mobile) {
	require('./mobile')
} else {
	require('./desktop')
}