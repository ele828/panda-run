## Sugar template
It's really simple, just using javascript as template script.

### Guide

#### Import sugar
* Browser

```html
<script src="../sugar.js"></script>
```

* Node.js

```javascript
var Sugar = require('../sugar');
var sugar = new Sugar;
```

#### Usage
* Configure

```javascript
var sugar = new Sugar({
	stag: '<%',
	etag: '%>',
	escape: false
});
// Another way
var sugar = new Sugar();
sugar.set({
	escape: false
});

```
* Basic usage
```javascript
var tpl1 = "<p>Hello, my name is <% this.name %>. I\'m <%this.profile.age%> years old.</p>";
var html = sugar.compile(
	tpl1,
	{
        name: 'Eric',
        profile: {
            age: 22
        }
    }
);
console.log(html);
```

* Loop & if

```javascript
var tpl2 = 'My skills:' +
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
```

* Native methods of Javascript

```javascript
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
```

* Browser script templating

```javascript
<script src="../sugar.js"></script>
<script id="tmpl" type="text/x-sugar-template">
    <h1>Sugar test</h1>
    <% if(run) %>
    <p>It runs.</p>
</script>
<script>
    var tmpl = document.querySelector('#tmpl').textContent;
    var sugar = new Sugar();
    document.body.innerHTML = sugar.compile(tmpl, { run:true });
</script>
```

### TODO
* [ ] More test case
* [ ] Support more js functions
* [ ] Include other template.
* [ ] Support simpler syntax instead of native js