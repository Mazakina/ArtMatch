export default function getSkillsOptions(req, res) {
  if (req.method === "GET") {
    const skills = [
      { id: "digital-art", name: "Arte Digital", icon: "" },
      { id: "tradicional-art", name: "Arte Tradicional", icon: "" },
      { id: "graffite", name: "Graffite", icon: "" },
      { id: "tattoo", name: "Tatuagem", icon: "" },
      { id: "character-design", name: "Design de Personagem", icon: "" },
      { id: "enviorement-design", name: "Design de Cenário", icon: "" },
      { id: "modeling", name: "Modelagem", icon: "" },
    ];
    return res.json(skills);
  }
}
