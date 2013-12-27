/**
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2013 Volker Theile
 * @copyright Copyright (c) 2013 OpenMediaVault Plugin Developers
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this file. If not, see <http://www.gnu.org/licenses/>.
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/form/field/CertificateComboBox.js")

/**
 * @class OMV.module.admin.system.shell.Settings
 * @derived OMV.workspace.form.Panel
 */

Ext.define("OMV.module.admin.system.shell.Settings", {
    extend : "OMV.workspace.form.Panel",

    rpcService   : "Shell",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    plugins      : [{
        ptype        : "linkedfields",
        correlations : [{
            name       : [
                "fontfamily",
                "fontsize"
            ],
            conditions : [
                { name  : 'enabletermsettings', value : true }
            ],
            properties : [
                "!allowBlank",
                "!readOnly"
            ]
         }]
    }],

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
    path      : "/system/shell",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.system.shell.Settings"
});
