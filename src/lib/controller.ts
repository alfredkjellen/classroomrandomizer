import { writable, derived } from 'svelte/store';

export const themeStore = writable('darktheme');

export const svgColor = derived(themeStore, $theme => $theme === 'darktheme' ? 'white' : 'black');

export const changeTheme = () => {
  themeStore.update(currentTheme => {
    const newTheme = currentTheme === 'darktheme' ? 'lighttheme' : 'darktheme';
    return newTheme;
  });
};

export const modalIsOpen = writable(false);