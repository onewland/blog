// Sample for http://oliveriskindoffunny.tumblr.com/post/*not-published-yet*/

function TimeInterval() {
	// Here, we are defining the offset as the number of seconds from 12:00 AM,
	// January 1st of an arbitrary year. The offset is something like the 
	// "origin" on a Cartesian graph.
	this.offset = 0;
	this.seconds = 0;
	this.addTo = function(ti) {
		this.seconds += ti.seconds;
		return this;
	};
}

function generate_multiplier(multiplier) {
	return function() {
		var interval = new TimeInterval();
		interval.seconds = this * multiplier;
		return interval;
	};
}

Number.prototype.seconds = generate_multiplier(1);
Number.prototype.minutes = generate_multiplier(60); 
Number.prototype.hours = generate_multiplier(3600);
Number.prototype.days = generate_multiplier(86400);
Number.prototype.weeks = generate_multiplier(604800);

var sys = require('sys');

function return_first_result_if_match(regex, str) {
	var m_result = str.match(regex);	
	if(m_result != null) { 
		return m_result[1]; 
	}
	else { 
		return false; 
	}
}

function create_interval_with_n_units(n, unit) {
	switch(unit)
	{
		case 'minute': 
			return (+n).minutes();
			break;
		case 'hour': 
			return (+n).hours();
			break;
		case 'second': 
			return (+n).seconds();
			break;
		case 'day': 
			return (+n).days();
			break;
		case 'week': 
			return (+n).weeks();
			break;
	}
}

exports.Time = function(time) {
	if(time instanceof TimeInterval){
		return time;
	}
	else if(typeof(time) == 'string') {
		var interval = new TimeInterval();
		if(time.match(/^(\d+) (month|week|day|hour|minute|second)s?/)) {
			var clauses = time.split(/, | and | & |  /);
			var clauses_length = clauses.length;
			for(var i = 0; i < clauses_length; i++) {
				var clause_parsed = clauses[i].match(/(\d+) (month|week|day|hour|minute|second)s?/);
				if(clause_parsed != null) {
					var time = clause_parsed[1];
					var unit = clause_parsed[2];
					interval.addTo(create_interval_with_n_units(time,unit));
				}
			}
		}
		else {
			var unit_parse = time.match(/month|week|day|hour|minute|second/);
			if(unit_parse != null) {
				interval.addTo(create_interval_with_n_units(1,unit));
			}
		}
		return interval;
	}
}

exports.Every = function(timeInterval, callback) {
	var parsed_time_interval = exports.Time(timeInterval);
	setInterval(callback, parsed_time_interval.seconds * 1000);
};
