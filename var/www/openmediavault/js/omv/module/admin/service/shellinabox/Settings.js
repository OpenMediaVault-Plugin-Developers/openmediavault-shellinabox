/**
 *
 * Copyright (c) 2013-2016 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")


/**
 * @class OMV.module.admin.service.shellinabox.Settings
 * @derived OMV.workspace.form.Panel
 */

Ext.define("OMV.module.admin.service.shellinabox.Settings", {
    extend : "OMV.workspace.form.Panel",

    rpcService   : "Shellinabox",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    plugins      : [{
        ptype        : "linkedfields",
        correlations : [{
            name       : [
                "fontfamily",
                "fontsize"
            ],
            conditions : [{
                name  : 'enabletermsettings',
                value : true
            }],
            properties : [
                "!allowBlank",
                "!readOnly"
            ]
         },{
            name       : [
                "enable"
            ],
            conditions : [
                { name : "enable", value : true }
            ],
            properties : function(valid, field) {
                this.setButtonDisabled("shellmanage", !valid);
                this.setButtonDisabled("shellstart", !valid);
            }
        }]
    }],

    getButtonItems : function() {
        var me = this;
        var items = me.callParent(arguments);
        items.push({
            id       : me.getId() + "-shellstart",
            xtype    : "button",
            text     : _("Start"),
            icon     : "images/play.png",
            iconCls  : Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled : true,
            scope    : me,
            handler  : function() {
                // Execute RPC.
                OMV.Rpc.request({
                    scope       : this,
                    callback    : function(id, success, response) {
                        this.doReload();
                    },
                    relayErrors : false,
                    rpcData     : {
                        service  : "Shellinabox",
                        method   : "doStart"
                    }
                });
            }
        },{
            id       : me.getId() + "-shellmanage",
            xtype    : "button",
            text     : _("Web Client"),
            icon     : "images/shellinabox.png",
            iconCls  : Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled : true,
            scope    : me,
            handler  : function () {
                window.open('/shellinabox', '_blank');
            }
        });
        return items;
    },

    getFormItems : function() {
        var me = this;
        return [{
            xtype         : "fieldset",
            title         : _("General settings"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items         : [{
                xtype      : "checkbox",
                name       : "enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype      : "combo",
                name       : "linkify",
                fieldLabel : _("Linkify"),
                store      : Ext.create("OMV.data.Store", {
                    fields  : [{
                        name : "value",
                        type : "string" }
                    ],
                    data: [
                        { value : "none" },
                        { value : "normal" },
                        { value : "aggressive" }
                    ]
                }),
                queryMode      : "local",
                displayField   : "value",
                valueField     : "value",
                allowBank      : false,
                typeAhead      : true,
                forceSelection : true,
                triggerAction  : "all",
                value          : "none"
            },{
                xtype      : "checkbox",
                name       : "enablebeep",
                fieldLabel : _("Beep"),
                boxLabel   : _("Enable sound on BEL character"),
                checked    : false
            }]
        },{
            xtype         : "fieldset",
            title         : _("Terminal settings"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items         : [{
                xtype      : "checkbox",
                name       : "enabletermsettings",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype      : "textfield",
                name       : "fontfamily",
                fieldLabel : _("Font"),
                value      : 'Courier New'
            },{
                xtype         : "numberfield",
                name          : "fontsize",
                fieldLabel    : _("Size"),
                minValue      : 1,
                maxValue      : 72,
                allowDecimals : false,
                allowBlank    : false,
                value         : 14
            }]
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "settings",
    path      : "/service/shellinabox",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.service.shellinabox.Settings"
});
