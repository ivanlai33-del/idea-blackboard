# LUMOS Component Sync Protocol v2.0

## 📜 The "Superset Principle" (LUMOS Law of Completeness)
As defined by the USER:
> **"The website can choose not to use certain objects from the Design System, but the Design System CANNOT lack any object that already exists in the website."**

This means the Design System sits as a **Superset** of the entire application's UI reality.

## 🛠️ Mandatory Operational Rules for AI Agent
1. **Discovery & Documentation**: Whenever a new UI component, widget, or specific visual pattern is implemented or discovered in the production code, it must be documented in `DesignSystem.tsx` (via its modular sub-components) in the very next turn.
2. **Reverse Sync**: If the website code changes a visual property (e.g., changing a shadow from `xl` to `2xl`), the Design System must be updated to reflect this new "Truth".
3. **Completeness Guarantee**: Before concluding any UI-related task, the AI must verify: *"Is every new element I just built represented in the Lego Library?"*

## 🏗️ Folder Structure (Modular v2.0)
All specs are located in `/components/DesignSystem/`:
- `SpecBrand.tsx`: Core identity.
- `SpecInteraction.tsx`: Behavior and sizing.
- `ModuleLegoParts.tsx`: Physical building blocks.
- `ModuleAppLogic.tsx`: Feature-specific UI.
- `ModuleMarketing.tsx`: Landing page blocks.

---
*This protocol is the primary directive for Antigravity AI when handling LUMOS UI tasks.*
