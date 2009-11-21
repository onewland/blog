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
		if(time.match(/^(\d+) (month|week|day|hour|minute|second)s?/))
		{
			var clauses = time.split(/, | and | & |  /);
			var clauses_length = clauses.length;
			sys.puts(clauses);
			for(var i = 0; i < clauses_length; i++)
			{
				sys.puts('clause: ' + clauses[i]);
				var clause_parsed = clauses[i].match(/(\d+) (month|week|day|hour|minute|second)s?/);
				if(clause_parsed != null)
				{
					var time = clause_parsed[1];
					var unit = clause_parsed[2];
					sys.puts(clause_parsed);
					switch(unit)
					{
						case 'minute': 
							interval.addTo((+time).minutes());
							break;
						case 'hour': 
							interval.addTo((+time).hours());
							break;
						case 'second': 
							interval.addTo((+time).seconds());
							break;
						case 'day': 
							interval.addTo((+time).days());
							break;
					}
				}
			}
		}	
		else
		{
			var unit_parse = time.match(/month|week|day|hour|minute|second/);
			if(unit_parse != null)
			{
				switch(unit_parse[0])
				{
					case 'minute': 
						interval.addTo((1).minutes());
						break;
					case 'hour': 
						interval.addTo((1).hours());
						break;
					case 'second': 
						interval.addTo((1).seconds());
						break;
					case 'day': 
						interval.addTo((1).days());
						break;
				}
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
