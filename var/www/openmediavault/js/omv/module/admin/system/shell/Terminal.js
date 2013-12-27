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
// require("js/omv/workspace/panel/Panel.js")

/**
 * @class OMV.module.admin.system.shell.Shell
 * @derived OMV.workspace.panel.Panel
 */

Ext.define("OMV.module.admin.system.shell.Terminal", {
    extend   : "OMV.workspace.panel.Panel",
    requires : [
        "OMV.Rpc",
        "OMV.window.MessageBox"
    ],

    initComponent : function() {
        var me = this;
        OMV.MessageBox.wait(null, _("Loading ..."));
        OMV.Rpc.request({
            scope    : me,
            callback : function(id, success, response) {
                if(success) {
                    if(response.running == true) {
                        me.embedTerminal();
                    } else {
                        me.embedWarning();
                    }

                    OMV.MessageBox.hide();
                } else {
                    OMV.MessageBox.error(null, error);
                }
            },
            rpcData : {
                service : "Shell",
                method  : "getStatus"
            }
        });

        me.callParent(arguments);
    },

    embedTerminal: function() {
        var me = this;

        me.html = "<form style='overflow: auto; height: 100%;'>" +
                    "<iframe src='/shell' name='shell' longsec='Shell in a box' width='100%' height='100%'/>" +
                  "<br/></form>";
    },

    embedWarning: function() {
        var me = this;

        me.html = "<form style='overflow: auto; height: 100%;'>" +
                    "<div class='x-box-aboutbox'><p>" +
                      _("The shell-in-a-box service is not currently running. Please enable it to access the terminal.") + "<br/>" +
                    "</p></div>" +
                  "<br/></form>";
    }

});

OMV.WorkspaceManager.registerPanel({
    id        : "terminal",
    path      : "/system/shell",
    text      : _("Terminal"),
    position  : 20,
    className : "OMV.module.admin.system.shell.Terminal"
});
