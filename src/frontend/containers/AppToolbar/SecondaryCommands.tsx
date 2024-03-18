import React from 'react';
import { observer } from 'mobx-react-lite';

import { IconSet, KeyCombo } from 'widgets';
import { MenuButton, MenuItem } from 'widgets/menus';
import { RendererMessenger } from 'src/ipc/renderer';
import { useStore } from 'src/frontend/contexts/StoreContext';
import { shell } from 'electron';

const SecondaryCommands = observer(() => {
  const { uiStore } = useStore();
  return (
    <MenuButton
      icon={IconSet.MORE}
      text="More"
      tooltip="See more"
      id="__secondary-menu"
      menuID="__secondary-menu-options"
    >
      {/* <MenuItem
        icon={IconSet.SEARCH_EXTENDED}
        onClick={uiStore.toggleAdvancedSearch}
        text="Advanced Search"
        accelerator={<KeyCombo combo={uiStore.hotkeyMap.advancedSearch} />}
      /> */}
      {/* <MenuItem
        icon={IconSet.HELPCENTER}
        onClick={uiStore.toggleHelpCenter}
        text="Help Center"
        accelerator={<KeyCombo combo={uiStore.hotkeyMap.toggleHelpCenter} />}
      /> */}
      <MenuItem
        icon={IconSet.SETTINGS}
        onClick={uiStore.toggleSettings}
        text="settings"
        accelerator={<KeyCombo combo={uiStore.hotkeyMap.toggleSettings} />}
      />
      <MenuItem
        icon={IconSet.THUMB_BG}
        onClick={() => {
          shell.openExternal('https://discord.gg/GdxuetuNkN'); // metatagger discord
        }}
        text="💡ideas + 🐞bugs"
      />
      <MenuItem
        icon={IconSet.HELPCENTER}
        onClick={() => {
          shell.openExternal(
            'https://foul-channel-e2c.notion.site/Photo-Folder-71473f9595304d4fb7832237a787c56b?pvs=4',
          );
        }}
        text="help center"
      />

      <MenuItem
        icon={IconSet.RELOAD}
        onClick={RendererMessenger.checkForUpdates}
        text="check for updates"
      />
      {/* <MenuItem icon={IconSet.LOGO} onClick={uiStore.toggleAbout} text="About" /> */}
    </MenuButton>
  );
});

export default SecondaryCommands;
