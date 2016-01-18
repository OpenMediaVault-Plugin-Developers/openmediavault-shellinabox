<?php
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

require_once("openmediavault/object.inc");
require_once("openmediavault/error.inc");
require_once "openmediavault/systemctl.inc";
require_once("openmediavault/config.inc");
require_once("openmediavault/rpcservice.inc");
require_once("openmediavault/notify.inc");
require_once("openmediavault/util.inc");

class OMVRpcServiceShellinabox extends OMVRpcServiceAbstract
{
    public function getName()
    {
        return "Shellinabox";
    }

    private function getPluginName()
    {
        return strtolower($this->getName());
    }

    private function getXPath()
    {
        return sprintf("//services/%s", $this->getPluginName());
    }

    private function getEventMessagePath()
    {
        return sprintf("org.openmediavault.services.%s", $this->getPluginName());
    }

    public function initialize() {
        $this->registerMethod("getSettings");
        $this->registerMethod("setSettings");
        $this->registerMethod("doStart");
    }

    public function getSettings($params, $context)
    {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, [
            "role" => OMV_ROLE_ADMINISTRATOR
        ]);

        // Get the configuration object.
        $object = $xmlConfig->get($this->getXPath());

        if(is_null($object)) {
            throw new OMVException(
            OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
            $this->getXPath()
            );
        }

        // Modify the result object.
        $object['enable']             = boolval($object['enable']);
        $object['enablebeep']         = boolval($object['enablebeep']);
        $object['enabletermsettings'] = boolval($object['enabletermsettings']);
        $object['fontsize']           = intval($object['fontsize']);

        return $object;
    }

    public function setSettings($params, $context)
    {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, [
            "role" => OMV_ROLE_ADMINISTRATOR
        ]);

        // Validate the parameters of the RPC service method.
        $this->validateMethodParams(
            $params,
            '{
                "type"       : "object",
                "properties" : {
                    "enable"             : { "type" : "boolean"},
                    "linkify"            : { "type" : "string"},
                    "enablebeep"         : { "type" : "boolean"},
                    "enabletermsettings" : { "type" : "boolean"},
                    "fontfamily"         : { "type" : "string"},
                    "fontsize"           : { "type" : "integer", "minimum" : 1, "maximum" : 72}
                }
            }'
        );

        // Prepare the configuration objects
        $object = [
            "enable"             => array_boolval($params, 'enable'),
            "linkify"            => $params['linkify'],
            "enablebeep"         => array_boolval($params, 'enablebeep'),
            "enabletermsettings" => array_boolval($params, 'enabletermsettings'),
            "fontfamily"         => $params['fontfamily'],
            "fontsize"           => $params['fontsize']
        ];

        // Set the configuration object.
        if ($xmlConfig->replace($this->getXPath(), $object) === false) {
            throw new OMVException(OMVErrorMsg::E_CONFIG_SET_OBJECT_FAILED);
        }

        // Notify about configuration changes.
        $dispatcher = &OMVNotifyDispatcher::getInstance();

        $dispatcher->notify(
            OMV_NOTIFY_MODIFY,
            $this->getEventMessagePath(),
            $object
        );

        // Return the configuration object.
        return $object;
    }
}

// Register the RPC service.
$rpcServiceMgr = &OMVRpcServiceMgr::getInstance();
$rpcServiceMgr->registerService(new OMVRpcServiceShellinabox());
