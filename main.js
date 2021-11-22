new Vue({
  el: '#app',
  created: function() {
    // Parses a single date, setting day type if it's current date or tomorrow's:
    const parseDate = (date, dayType) => {
      let todayStartOfDay = luxon.DateTime.fromJSDate(this.currentDate).startOf('day');
      let tomorrowStartOfDay = luxon.DateTime.fromJSDate(this.currentDate).plus({day: 1}).startOf('day');
      let parsedStartOfDay = luxon.DateTime.fromJSDate(new Date(date)).startOf('day');

      if (parsedStartOfDay.equals(todayStartOfDay)) this.todayIs = dayType;
      if (parsedStartOfDay.equals(tomorrowStartOfDay)) this.tomorrowWillBe = dayType;

      return new Date(date);
    }
    // Parses a date reange, setting day type if current date (or tomorrow's) is within range:
    const parseDateRange = (range, dayType) => {
      let todayStartOfDay = luxon.DateTime.fromJSDate(this.currentDate).startOf('day');
      let tomorrowStartOfDay = luxon.DateTime.fromJSDate(this.currentDate).plus({day: 1}).startOf('day');
      let rangeStartOfDay = luxon.DateTime.fromJSDate(new Date(range.start)).startOf('day');
      let rangeEndOfDay = luxon.DateTime.fromJSDate(new Date(range.end)).startOf('day');

      if (rangeStartOfDay <= todayStartOfDay && rangeEndOfDay >= todayStartOfDay) this.todayIs = dayType;
      if (rangeStartOfDay <= tomorrowStartOfDay && rangeEndOfDay >= tomorrowStartOfDay) this.tomorrowWillBe = dayType;

      return {start: new Date(range.start), end: new Date(range.end)};
    }
    // Parses an entry from dates json (date or range object):
    const parseEntry = (entry, dayType) => {
      if (entry instanceof Object) return parseDateRange(entry, dayType);
      return parseDate(entry, dayType);
    }
    // adds remote dates to v-calendar attributes:
    this.attributes.push({
      key: 'remoteDays',
      highlight: true,
      popover: {
        label: 'Working from home!'
      },
      dates: dates.remoteDates.map( date => parseEntry(date, 'remoteDay') )
    })
    // adds free dates to v-calendar attributes:
    this.attributes.push({
      key: 'freeDays',
      highlight: 'green',
      popover: {
        label: 'FREE DAY!'
      },
      dates: dates.freeDates.map( date => parseEntry(date, 'freeDay') )
    });
    // adds special dates to v-calendar attributes:
    this.attributes.push({
      key: 'specialDays',
      highlight: 'orange',
      popover: {
        label: 'Special Day!'
      },
      dates: dates.specialDates.map( date => parseEntry(date, 'freeDay') )
    });
    // check if today will be weekend:
    let todayWeekday = (this.currentDate).getDay();
    if (todayWeekday == 6 || todayWeekday == 0) this.todayIs = 'weekendDay';
    // check if tomorrow will be weekend:
    if (todayWeekday == 5 || todayWeekday == 6) this.tomorrowWillBe = 'weekendDay';

  },

  data: {

    // currentDate: new Date(),
    currentDate: new Date(),
    todayIs: 'officeDay',
    tomorrowWillBe: 'officeDay',

    attributes: [
      // highlight current day:
      {
        key: 'today',
        bar: 'red',
        dates: this.currentDate
      },
      // highlight current week:
      {
        key: 'current-week',
        highlight: {
          color: null,
          class: 'custom'
        },
        order: -1,
        dates: [{start: luxon.DateTime.local().startOf('week').toJSDate(), end: luxon.DateTime.local().endOf('week').toJSDate()}]
      }
    ]

  },

  computed: {

    todayIsRemote: function() {
      return this.todayIs === 'remoteDay';
    },

    todayIsOffice: function() {
      return this.todayIs === 'officeDay';
    },

    todayIsFree: function() {
      return this.todayIs === 'freeDay';
    },

    todayIsWeekend: function() {
      return this.todayIs === 'weekendDay';
    },

    tomorrowWillBeRemote: function() {
      return this.tomorrowWillBe === 'remoteDay';
    },

    tomorrowWillBeOffice: function() {
      return this.tomorrowWillBe === 'officeDay';
    },

    tomorrowWillBeFree: function() {
      return this.tomorrowWillBe === 'freeDay';
    },

    tomorrowWillBeWeekend: function() {
      return this.tomorrowWillBe === 'weekendDay';
    },

    tomorrowMessage: function() {
      if (this.tomorrowWillBeWeekend) return 'Enjoy the weekend!';
      if (this.tomorrowWillBeFree) return 'NO WORKING TOMORROW!';
      if (this.tomorrowWillBeOffice) return 'Tomorrow working from OFFICE';
      if (this.tomorrowWillBeRemote) return 'Tomorrow working from HOME!';
    }
  }
})
