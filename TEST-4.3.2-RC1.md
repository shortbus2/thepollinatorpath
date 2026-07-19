# Garden Brain 4.3.2 RC1 staging verification

## Connection
- [ ] Staging Pages loads from the beta branch.
- [ ] Garden Brain reports `4.3.2-rc.1-species-integrity`.
- [ ] Connection badge shows AI ready.

## Garden Walk capture
- [ ] One **Add photos** control opens the native photo picker.
- [ ] The personal memory field is blank after AI analysis.
- [ ] Garden Brain reasoning remains visible separately.
- [ ] A detected wildlife visitor can be marked as the primary subject.
- [ ] All additional approved plants/visitors remain linked.

## Species integrity
- [ ] Existing pages such as Brenda still appear and open.
- [ ] Creating a new wildlife page does not remove or overwrite existing pages.
- [ ] Publishing a new visitor as primary replaces the unknown placeholder.
- [ ] Selecting “Use the first photo as this subject’s current portrait” updates the selected primary subject only.
- [ ] The same observation appears on all linked subject pages.
- [ ] **Manage this visitor** opens the correct Taxonomy Manager record.

## Edit propagation
- [ ] Edit a recent memory’s personal text and save.
- [ ] Refresh **Two most recent memories** and confirm the edited text appears.
- [ ] Confirm the observation page and linked subject page show the same current text.

## Regression
- [ ] Homepage reads **This Week in the Garden** without a Garden Walk count or field-note language.
- [ ] Production remains unchanged during staging testing.
- [ ] No browser-console errors on homepage, Garden Walk, wildlife, plant, and taxonomy pages.
