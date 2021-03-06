<?php
/**
 * Shopware 5
 * Copyright (c) shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 */

/**
 * Shopware Systeminfo Controller
 *
 * This controller reads out all necessary configs.
 */
class Shopware_Controllers_Backend_Systeminfo extends Shopware_Controllers_Backend_ExtJs
{
    public function initAcl()
    {
        $this->addAclPermission("getConfigList", "read", "You're not allowed to open the module.");
        $this->addAclPermission("getPathList", "read", "You're not allowed to open the module.");
        $this->addAclPermission("getFileList", "read", "You're not allowed to open the module.");
        $this->addAclPermission("getVersionList", "read", "You're not allowed to open the module.");
        $this->addAclPermission("getEnconder", "read", "You're not allowed to open the module.");
        $this->addAclPermission("info", "read", "You're not allowed to open the module.");
    }

    /**
     * Disable template engine for all actions
     *
     * @return void
     */
    public function preDispatch()
    {
        if (!in_array($this->Request()->getActionName(), array('index', 'load', 'info'))) {
            $this->Front()->Plugins()->Json()->setRenderer(true);
        }
    }

    /**
     * Function to get all system-configs and its requirements
     * The array also contains a status, whether the minimum requirements are met
     * The encoder-configs are excluded, because they are needed in another store
     * getEncoderAction loads those two encoder-configs
     */
    public function getConfigListAction()
    {
        $list = new Shopware_Components_Check_System();
        $data = $list->toArray();
        foreach ($data as $key => &$config) {
            //Those configs mustn't be displayed in the grid
            if ($config['name'] == 'ionCube Loader') {
                unset($data[$key]);
            }
        }
        $this->View()->assign(array('success' => true, 'data' => array_merge($data)));
    }

    /**
     * Function to get all necessary paths and a status, whether the paths are available
     */
    public function getPathListAction()
    {
        $list = new Shopware_Components_Check_Path();
        $this->View()->assign(array('success' => true, 'data' => $list->toArray()));
    }

    /**
     * Function to get all necessary files and the status, whether those files match with the original Shopware-Files
     */
    public function getFileListAction()
    {
        $fileName = Shopware()->AppPath() . '/Components/Check/Data/Files.md5sums';


        if (!is_file($fileName)) {
            $this->View()->assign(array('success' => true, 'data' => array()));
            return;
        }

        // skip files from check
        $skipList = [
        ];

        $list = new Shopware_Components_Check_File($fileName, Shopware()->DocPath(), $skipList);

        $this->View()->assign(array('success' => true, 'data' => $list->toArray()));
    }

    /**
     * Function to get all plugins and its version.
     */
    public function getVersionListAction()
    {
        $select = Shopware()->Db()->select()->from(
            's_core_plugins',
            array('version', 'name', 'namespace', 'source')
        );

        $rows = Shopware()->Db()->fetchAll($select);

        foreach ($rows as $key => $row) {
            $rows[$key]['name'] = $row['namespace'] . '/' . $row['source'] . '/' . $row['name'];
        }

        array_unshift($rows, array('name' => 'Shopware', 'version' => Shopware()->Config()->Version));

        $this->View()->assign(array('success' => true, 'data' => $rows));
    }

    /**
     * Function to get the active encoders
     */
    public function getEncoderAction()
    {
        $list = new Shopware_Components_Check_System();
        $data = $list->toArray();
        foreach ($data as $key => &$config) {
            if ($config['name'] != 'ionCube Loader') {
                continue;
            }
            if ($config['name'] === 'ionCube Loader' && $config['result'] === true) {
                $encoder = $config;
                break;
            }
        }
        if (empty($encoder)) {
            $encoder = "none";
        }

        $this->View()->assign(array('success' => true, 'data' => $encoder));
    }

    /**
     * Function to display the phpinfo
     */
    public function infoAction()
    {
        Shopware()->Plugins()->Controller()->ViewRenderer()->setNoRender();
        $_COOKIE = array();
        $_REQUEST = array();
        $_SERVER['HTTP_COOKIE'] = null;
        if (function_exists('apache_setenv')) {
            apache_setenv('HTTP_COOKIE', null);
        }
        phpinfo();
    }
}
