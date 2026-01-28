# Stellar Web - Code Quest Assignment

## Assignment Overview

**From Particles to Networks**

This Code Quest builds upon the Starfield quest by introducing **relationships between particles**. Instead of particles acting independently, this assignment explores emergent networks where simple proximity rules create complex structures.

---

## Key Concepts

### Emergent Networks
Complex structures that arise not from design, but from simple proximity rules applied across many elements. Each node drifts through space independently, but when you add the rule *"draw a line between any two nodes that are close enough"*, webs and constellations emerge naturally.

### The Connectivity Radius
The magic parameter that determines how close two nodes must be before an edge appears between them:

- **Small radius** → sparse, isolated clusters
- **Medium radius** → delicate webs with local structure  
- **Large radius** → dense meshes approaching full connectivity

---

## Real-World Applications

This proximity-based connection rule underlies networks in many fields:

- 🧠 **Neuroscience**: Brain Connectivity Mapping
- 🦠 **Epidemiology**: Contact Tracing Networks
- 🌐 **Computer Networks**: Mesh Networks & Internet Topology
- 🐝 **Ecology**: Food Webs & Species Interactions
- 💼 **Social Science**: Social Network Analysis
- ⚛️ **Chemistry**: Molecular Bonding Networks

---

## Main Task

**Create a webpage that uses a particle system to create a "Stellar Web" visualization.**

Your webpage should:
1. Display nodes (particles) moving through 3D space
2. Draw edges (connections) between nodes within the connectivity radius
3. Include sliders that allow users to control animation attributes
4. Create dynamic network structures that change as nodes move

---

## Important Keywords for Your Prompt

When creating your prompt to build this visualization, consider including these terms:

- **node** - the individual particles/points
- **edge** - the lines connecting nodes
- **thickness** - width of the connection lines
- **transparency/opacity** - visibility of edges and nodes
- **connectivity radius** - the distance threshold for connections
- **3D space** - the dimensional environment for particles

Additional attributes suggested by slider controls should also be included.

---

## Ideas to Explore

### Basic Enhancements
- Experiment with different connectivity radius values to see how network density changes
- Add color gradients that change based on edge length or node velocity
- Implement depth effects with size and opacity varying by z-position

### Interactive Features
- Add mouse interaction so nodes are attracted to or repelled by the cursor
- Create pulsing effects to nodes or edges

---

## Stretch Challenge

### UI Improvement
Modify the position of the sliders so they don't cover the animation. Options include:
- Moving them outside the display area
- Creating a collapsible side panel
- Placing them below the canvas

### Bonus: Network Statistics Panel
Add a real-time statistics display showing:
- Total number of edges
- Average connections per node
- Network density
- Other relevant metrics

---

## Technical Considerations

### Core Components Needed
1. **Particle System**: Nodes that move through 3D space
2. **Edge Detection**: Algorithm to check distance between all node pairs
3. **Rendering System**: Draw nodes and connecting edges
4. **User Controls**: Sliders for adjustable parameters
5. **Animation Loop**: Continuous update and render cycle

### Key Parameters to Control
- Number of nodes
- Connectivity radius
- Node speed/velocity
- Edge appearance (color, thickness, opacity)
- Particle size
- Depth effects

### Performance Tips
- Consider optimizing edge detection for large numbers of nodes
- Use transparency/opacity effectively to show depth
- Balance visual quality with smooth animation

---

## Learning Objectives

By completing this Code Quest, you will understand:
- How simple rules create complex emergent behavior
- The relationship between proximity and network structure
- How to visualize dynamic networks
- How connectivity parameters affect network topology
- Real-world applications of network visualization

---

## Getting Started

1. Study the interactive demo on the assignment page
2. Observe how different slider values affect the network
3. Write a detailed prompt describing the visualization you want to create
4. Include all relevant keywords and parameters
5. Test and iterate on your implementation
6. Experiment with the enhancement ideas
7. Attempt the stretch challenge if time permits

---

## Success Criteria

Your completed project should:
- ✅ Display moving nodes in 3D space
- ✅ Draw edges between nodes within connectivity radius
- ✅ Include functional sliders for parameter control
- ✅ Create visually appealing network structures
- ✅ Run smoothly without performance issues
- ✅ Allow real-time exploration of different network configurations

---

## Notes

This assignment introduces fundamental concepts in:
- Network theory
- Emergent systems
- Graph visualization
- Interactive data visualization
- Computational geometry (proximity detection)

The skills you develop here apply to numerous fields beyond computer graphics, from analyzing social networks to understanding biological systems.
