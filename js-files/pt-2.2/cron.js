// Sample for http://oliveriskindoffunny.tumblr.com/post/247975858/implementing-a-user-friendly-cron-module-with-node-js
function TimeInterval() {
	this.seconds = 0;
	this.addTo = function(ti) {
		this.seconds += ti.seconds;
		return this;
	};
}

function generate_multiplier(multiplier)
{
	return function() {
		var interval = new TimeInterval(); // use var keyword!
		interval.seconds = this * multiplier;
		return interval;
	};
}

Number.prototype.seconds = generate_multiplier(1);
Number.prototype.minutes = generate_multiplier(60); 
Number.prototype.hours = generate_multiplier(3600);
Number.prototype.days = generate_multiplier(86400);

var sys = require('sys');

function return_first_result_if_match(regex, str) {
	var m_result = str.match(regex);	
	if(m_result != null) 
	{ 
		return m_result[1]; 
	}
	else 
	{ 
		return false; 
	}
}

exports.Time = function(time) {
	if(time instanceof TimeInterval)
	{
		return time;
	}
	else if(typeof(time) == 'string')
	{
		var interval = new TimeInterval();
		var clauses = time.split(/, | and | & | /);
		var clauses_length = clauses.length;
		for(clause in clauses)
		{
			var days = return_first_result_if_match(/(\d+) days?/,clause);
			var hours = return_first_result_if_match(/(\d+) hours?/,clause);
			var mins = return_first_result_if_match(/(\d+) minutes?/,clause);
			var secs = return_first_result_if_match(/(\d+) seconds?/,clause);
			if(mins)	
			{
				interval.addTo((+mins).minutes());
			}
			else if(hours)
			{
				interval.addTo((+hours).hours());
			}
			else if(days)
			{
				interval.addTo((+days).days());
			}
			else if(secs)
			{
				interval.addTo((+secs).seconds());
			}
		}
		return interval;
	}
}

exports.Every = function(timeInterval, callback) {
	setInterval(callback, timeInterval.seconds * 1000);
};

sys.puts(exports.Time('5 minutes').seconds);
sys.puts(exports.Time('5 hours').seconds);
sys.puts(exports.Time('5 days').seconds);
sys.puts(exports.Time('1 minute and 5 seconds').seconds);
sys.puts(exports.Time('1 hour & 1 minute and 5 seconds').seconds);
sys.puts(exports.Time('1 minute 1 second').seconds);
sys.puts(exports.Time((5).seconds()).seconds);