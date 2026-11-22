'use strict';
'require view';
'require dom';
'require poll';
'require uci';
'require rpc';
'require form';
'require ui';
'require fs';
'require tools.widgets as widgets';
var callGetPoEUsers, handleDelRule, callDeleteRule, handleEditRule, callEditRule, handleAddRule, callAddRule;

callGetPoEUsers = rpc.declare({
	object: 'luci.poe',
	method: 'get_users',
	expect: {}
});

handleDelRule = function (num, ev) {

	callDeleteRule(num);
	ui.showModal(_('PPPoE Server'), [E('p', { 'class': 'spinning' }, _('Please wait...<br />Deleting PPPoE Account<br /> '))]);
	window.setTimeout(function () {
		ui.hideModal();
		location.reload();
	}, 3000);

};
handleAddRule = function (ev) {
	var user = document.getElementById('user').value;
	var passwd = document.getElementById('password').value;
	var localip = document.getElementById('widget.cbid.pppoe.cfg01637f.localip').value;
	callAddRule(user, passwd, localip);
	ui.showModal(_('PPPoE Server'), [E('p', { 'class': 'spinning' }, _('Please wait...<br />Adding PPPoE Account<br /> '))]);
	window.setTimeout(function () {
		ui.hideModal();
		location.reload();
	}, 3000);

};
handleEditRule = function (num, ev) {
	var user = document.getElementById('euser').value;
	var passwd = document.getElementById('epassword').value;
	var ipadd = document.getElementById('eipaddr').value;

	callEditRule(num, user, passwd,ipadd);
	ui.showModal(_('PPPoE Server'), [E('p', { 'class': 'spinning' }, _('Please wait...<br />Updating PPPoE Account<br /> '))]);
	window.setTimeout(function () {
		ui.hideModal();
		location.reload();
	}, 3000);
};

callDeleteRule = rpc.declare({
	object: 'luci.poe',
	method: 'delete_user',
	params: ['token'],
	expect: {
		result: "OK"
	},
});
callEditRule = rpc.declare({
	object: 'luci.poe',
	method: 'edit_user',
	params: ['token', 'user', 'passwd','ipadd'],
	expect: {
		result: "OK"
	},
});
callAddRule = rpc.declare({
	object: 'luci.poe',
	method: 'add_user',
	params: ['user', 'passwd', 'localip'],
	expect: {
		result: "OK"
	},
});
return view.extend({
	showAddUser: function () {

		ui.showModal(_('PPPoE Server'), [
			E('p', _("Register New PPPoE Account.")),
			E('div', { 'class': 'left', 'style': 'display:flex; flex-direction:column' }, [
				E('label', { 'class': 'cbi-input-text', 'style': 'padding:1.5em' }, [
					E('label', _("User:<br />")), E('input', { 'class': 'cbi-input-text', 'style': 'width:200px', 'spellcheck': 'false', 'id': 'user', 'value': '' }, []),
					E('p', _("")), E('label', _("Password:<br />")), E('input', { 'class': 'cbi-input-password', 'type': 'text', 'style': 'width:200px', 'spellcheck': 'false', 'id': 'password', 'value': '' }, [])])
			]),
			E('div', { 'class': 'right' }, [
				E('button', {
					'class': 'btn',
					'click': ui.hideModal
				}, _('Cancel')), ' ',
				E('button', {
					'class': 'btn cbi-button cbi-button-positive important',
					'click': L.bind(handleAddRule, this)
				}, _('Proceed'))
			])
		]);
	},
	showEditUser: function (num, user, passwd, ipaddr, ev) {
		ui.showModal(_('PPPoE Server'), [
			E('p', _("Edit PPPoE Account.")),
			E('div', { 'class': 'left', 'style': 'display:flex; flex-direction:column' }, [
				E('label', { 'class': 'cbi-input-text', 'style': 'padding:1.5em' }, [
					E('label', _("User:<br />")), E('input', { 'class': 'cbi-input-text', 'style': 'width:200px', 'spellcheck': 'false', 'id': 'euser', 'value': user }, []),
					E('p', _("")), E('label', _("Password:<br />")), E('input', { 'class': 'cbi-input-password', 'type': 'text', 'style': 'width:200px', 'spellcheck': 'false', 'id': 'epassword', 'value': passwd }, []),
					E('input', { 'class': 'cbi-input-text', 'type': 'text', 'style': 'width:200px;display:none', 'spellcheck': 'false', 'id': 'eipaddr', 'value': ipaddr }, [])])
			]),
			E('div', { 'class': 'right' }, [
				E('button', {
					'class': 'btn',
					'click': ui.hideModal
				}, _('Cancel')), ' ',
				E('button', {
					'class': 'btn cbi-button cbi-button-positive important',
					'click': L.bind(handleEditRule, ev, num)
				}, _('Proceed'))
			])
		]);
	},
	showrebootModal: function () {
		ui.showModal(_('Shutting down...'), [E('p', {
			'class': 'spinning'
		}, _('The system is shutting down now.<br /> DO NOT POWER OFF THE DEVICE!<br /> It might be necessary to renew the address of your computer to reach the device again, depending on your settings.'))
			,
		E('div', { 'class': 'right' }, [
			E('button', {
				'class': 'btn',
				'click': ui.hideModal
			}, _('Cancel')), ' ',
			E('button', {
				'class': 'btn cbi-button cbi-button-positive important',
				'click': L.bind(this.showrebootModal, this)
			}, _('Remove'))
		])

		]);
	},

	delModal: function (num, ev) {
		ui.showModal(_('PPPoE Server'), [E('p', {
			'class': 'left'
		}, _('<br />Click "Remove" if you want to remove this account.')),
		E('div', { 'class': 'right' }, [
			E('button', {
				'class': 'btn',
				'click': ui.hideModal
			}, _('Cancel')), ' ',
			E('button', {
				'class': 'btn cbi-button cbi-button-remove important',
				'click': L.bind(handleDelRule, ev, num)
			}, _('Remove'))
		])

		]);
	},

	load: function () {
		return Promise.all([callGetPoEUsers()]);
	},

	poll_status: function (nodes, data) {
		var rules = Array.isArray(data[0].accounts) ? data[0].accounts : [];
		rules.sort(function (a, b) {
			return a.id - b.id;
		});
		var n = 0;
		var rows = rules.map(function (rule) {
			n = n + 1;
			return [n, rule.user, rule.password, rule.ipaddr, E('div', { 'class': 'center' }, [
				E('button', {
					'class': 'btn cbi-button-edit',
					'click': ui.createHandlerFn(this, 'showEditUser', rule.ipaddr, rule.user, rule.password)
				}, _('Edit')), ' ',
				E('button', {
					'class': 'btn cbi-button cbi-button-remove important',
					'click': ui.createHandlerFn(this, 'delModal', rule.id)
				}, _('Remove'))
			])];
		});

		cbi_update_table(nodes.querySelector('#users_table'), rows, E('em', _('There are no account to display.')));

		return;
	},
	render: function (data) {
		var m, s, o;
		m = new form.Map('pppoe', [_('PPPoE Server')]);

		s = m.section(form.TypedSection, "pppoe_server", _("Server Configuration"))
		s.addremove = false
		s.anonymous = true

		o = s.option(widgets.DeviceSelect, 'interface', _('Interface'), _('Interface on which to listen.'));
		o.nocreate = true;
		o.unspecified = true;

		o = s.option(form.Value, "localip", _("IP of listening side"))
		o.datatype = "ipaddr"

		o = s.option(form.Value, "maxsessions", _("Maximum sessions"))
		o.datatype = "uinteger"
		o.default = 64
		o.optional = true

		s = m.section(form.GridSection, '_active_users');
		s.render = L.bind(function (view, section_id) {

			var table = E('table', {
				'class': 'table cbi-section-table',
				'id': 'users_table'
			}, [E('tr', { 'class': 'tr table-titles' },
				[E('th', { 'class': 'th' }, _('No.')),
				E('th', { 'class': 'th' }, _('User')),
				E('th', { 'class': 'th' }, _('Password')),
				E('th', { 'class': 'th' }, _('IP Address')),
				E('th', { 'class': 'th cbi-section-actions' }, '')])]);


			var rules = Array.isArray(data[0].accounts) ? data[0].accounts : [];
			rules.sort(function (a, b) {
				return a.id - b.id;
			});
			var n = 0;
			var rows = rules.map(function (rule) {
				n = n + 1;
				return [n, rule.user, rule.password, rule.ipaddr, E('div', { 'class': 'center' }, [
					E('button', {
						'class': 'btn cbi-button-edit',
						'click': ui.createHandlerFn(view, 'showEditUser', rule.id, rule.user, rule.password, rule.ipaddr)
					}, _('Edit')), ' ',
					E('button', {
						'class': 'btn cbi-button cbi-button-remove important',
						'click': ui.createHandlerFn(view, 'delModal', rule.id)
					}, _('Remove'))
				])];
			});

			cbi_update_table(table, rows, E('em', _('There are no account to display.')));

			return E('div', {
				'class': 'cbi-section cbi-tblsection'
			}, [E('h3', _('PPPoE Accounts')), E('button', {
				'class': 'btn cbi-button cbi-button-positive important',
				'click': ui.createHandlerFn(view, 'showAddUser')
			}, _('Add User')), E('p', _("")), table]);
		}, o, this);

		return m.render().then(L.bind(function (m, nodes) {
			poll.add(L.bind(function () {
				return Promise.all([callGetPoEUsers()]).then(L.bind(this.poll_status, this, nodes));
			}, this), 5);
			return nodes;
		}, this, m));
	}
});

