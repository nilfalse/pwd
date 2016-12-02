var passwordLength = 12;

var Passwd = (function(window, undefined) {
    function Passwd() {}

    function Passwd__getRandomValues(length, maxNum) {
        var rv = [];
        var l = length;
        while (l--) {
            rv.push(Math.floor(Math.random() * maxNum))
        }
        return rv;
    }
    Passwd.prototype.getRandomValues = Passwd__getRandomValues;

    function Passwd__gen(chars, length) {
        return this.getRandomValues(length, chars.length).map(function(pos) {
            return chars.substring(pos, pos + 1);
        }).join('');
    }
    Passwd.prototype.gen = Passwd__gen;

    function Passwd__mkList(count, chars, length) {
        var rv = [];
        var l = count;
        while (l--) {
            rv.push(this.gen(chars, length));
        }
        return rv;
    }
    Passwd.prototype.mkList = Passwd__mkList;

    return Passwd;
}(this));

var passwordList = (function(window, undefined) {
    var passwordsContainer = document.querySelector('.app__list');
    var _cache = {};

    function renderPassword(password) {
        var div = document.createElement('div');
        var samp = document.createElement('samp');
        samp.textContent = password;
        div.appendChild(samp);
        return div;
    }

    function passwordList__clear() {
        passwordsContainer.innerHTML = '';
        _cache = {};
    }

    function passwordList__render(passwords) {
        return passwords.forEach(function(p) {
            if (p in _cache) {
                return;
            }
            var node = renderPassword(p);
            _cache[p] = node;
            passwordsContainer.appendChild(node);
        });
    }

    return {
        render: passwordList__render,
        clear: passwordList__clear
    };
}(this));

(function(window, undefined) {
    var inputs = Array.prototype.slice.call(document.getElementsByClassName('password-range__input'));
    var countControl = document.querySelector('.app__passwords-count-control');
    var passwd = new Passwd();

    function getCount() {
        return Math.max(countControl.valueAsNumber || parseInt(countControl.value, 10) || 10, 1);
    }

    function makePasswords(count, length) {
        var chars = inputs
            .filter(function(node) { return node.checked; })
            .map(function(node) { return node.value; })
            .join('');
        return passwd.mkList(count, chars, length);
    }

    document.querySelector('.app__clear-button').addEventListener('click', function(e) {
        passwordList.clear();
        passwordList.render(makePasswords(getCount(), passwordLength));
    });

    document.querySelector('.app__more-button').addEventListener('click', function(e) {
        passwordList.render(makePasswords(getCount(), passwordLength));
    });

    document.body.addEventListener('change', function(e) {
        if (!e.target.matches('.password-range__input')) {
            return;
        }
        passwordList.clear();
        passwordList.render(makePasswords(getCount(), passwordLength));
    });

    passwordList.render(makePasswords(getCount(), passwordLength));
}(this));
