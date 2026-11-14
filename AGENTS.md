<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the prompt-first shop at `/` and the product configurator at `/design`; requests travel as validated search state so direct links remain usable.
- Keep shared shop chrome and sticker illustrations in browser-safe components; customization is client-side and requires no server persistence.
- Define the shop's visual styles and semantic palette in `src/styles.css` so the home and designer share one design system.
