var Sugar = require('../sugar');
var sugar = new Sugar;

var tpl1 = "<p>Hello, my name is <% this.name %>. I\'m <%this.profile.age%> years old.</p>";
console.log(
    sugar.compile(tpl1, {
        name: 'Eric',
        profile: {
            age: 22
        }
    })
);

var tpl2 =
    'My skills:' +
    '<%if(data.showSkills) {%>' +
    '<%for(var index in data.skills) {%>' +
    '<a href="#"><%data.skills[index]%></a>' +
    '<%}%>' +
    '<%} else {%>' +
    '<p>none</p>' +
    '<%}%>' +
    '<h1>Its very cool</h1>';

var html = sugar.compile(tpl2, {
    data: {
        skills: ['js', 'html', 'css'],
        showSkills: true
    }
});
console.log(html);

var tpl3 = '<p>Test:</p>' +
    '<% k.forEach(function(item) { %>' +
    '<% if(item.show) { %>' +
    '<p><%item.name%></p>' +
    '<% } %>' +
    '<% }); %>';


console.log(
  sugar.compile(tpl3, {
      k: [
          {name: 'Eric', show: true},
          {name: 'Jeff', show: false},
          {name: 'Vincent', show: true}
      ]
  })
);
