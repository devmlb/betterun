import './style.css';

export default defineContentScript({
  matches: ['https://*.univ-nantes.fr/*'],
  runAt: 'document_start',
  main() {
    const font = new FontFace(
      'Material Icons Round',
      `url(${browser.runtime.getURL('/material-icons-round.woff2')})`,
      {
        style: 'normal',
        weight: '400',
      }
    );
    document.fonts.add(font);
    font.load();
  },
});
