import Block from 'quill/blots/block';
import { HIGHLIGHT_LANGUAGES, registerHighlightLanguages } from './highlight-languages';

export async function loadQuillModules(): Promise<void> {

  const [QuillModule, BlocKModule, SyntaxModule] = await Promise.all([
    import('quill'), import('quill/blots/block'), import('quill/modules/syntax')
  ]);

  registerHighlightLanguages();

  BlocKModule.default.tagName = "DIV";
  SyntaxModule.default.register();
  SyntaxModule.default.DEFAULTS.languages = HIGHLIGHT_LANGUAGES;
  QuillModule.default.register(Block, true);
  QuillModule.default.register(SyntaxModule, true);

}