# Blender CLI Workflow for 3D Model Automation

This document describes how to use Blender's command-line interface for automated 3D model processing, rigging, and animation tasks.

## Running Blender in Background Mode

Blender can run headlessly (without GUI) using the `-b` or `--background` flag:

```bash
# Run a Python script in background mode
blender -b --python script.py

# Run with a specific file
blender -b scene.blend --python script.py

# Run with arguments passed to the script
blender -b --python script.py -- arg1 arg2
```

## Example: Auto-Rig and Export glTF

```python
# auto_rig_cat.py
import bpy
import sys

# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Import the model
bpy.ops.import_mesh.gltf(filepath='assets/cat/scene.gltf')

# TODO: Add rigging logic here (requires manual setup first)
# For now, this is a placeholder for future automation

# Export with animations
bpy.ops.export_scene.gltf(
    filepath='assets/cat/animated_cat.gltf',
    export_animations=True,
    export_format='GLTF_SEPARATE'
)

print("Export complete!")
```

Run with:
```bash
blender -b --python auto_rig_cat.py
```

## Example: Batch Export Animations

```python
# export_animations.py
import bpy

# Load scene with rig
bpy.ops.import_scene.gltf(filepath='character_with_rig.glb')

# Get the action (animation)
actions = bpy.data.actions
for action in actions:
    # Set as active animation
    bpy.context.object.animation_data.action = action

    # Export
    bpy.ops.export_scene.gltf(
        filepath=f'exports/{action.name}.gltf',
        export_animations=True
    )
```

## Useful CLI Commands

```bash
# Render a single frame
blender -b scene.blend --render-frame 1

# Render an animation
blender -b scene.blend --render-animation

# Run Python script with custom arguments
blender -b --python script.py -- input.glb output.glb

# Access arguments in Python
import sys
args = sys.argv[sys.argv.index('--') + 1:]  # Everything after '--'
```

## Resources

- [Blender CLI Documentation](https://docs.blender.org/manual/en/latest/advanced/command_line/index.html)
- [Blender Python API](https://docs.blender.org/api/current/)
- [blender-cli-render](https://github.com/elarry/blender-cli-render) - Community scripts for CLI rendering

## When to Use CLI vs GUI

**Use CLI for:**
- Automated batch processing
- Server-side rendering
- CI/CD pipelines
- Reproducible workflows

**Use GUI for:**
- Initial rigging and UV unwrapping
- Manual sculpting and texturing
- Visual debugging
- Complex animation work

---

**Note:** For our cat model, we used Sketchfab's pre-rigged model with included animations. Blender CLI can be used in the future for:
- Adding new animations to existing rigs
- Batch exporting multiple LOD (Level of Detail) versions
- Optimizing geometry for web performance
- Converting between formats
