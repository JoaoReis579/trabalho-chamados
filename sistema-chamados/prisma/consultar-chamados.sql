SELECT
  c.id,
  c.titulo,
  c.situacao,
  c.prioridade,
  solicitante.nome AS solicitante,
  tipo.nome AS tipoProblema,
  comentario.texto AS comentario,
  comentario.criadoEm AS comentarioCriadoEm
FROM Chamado AS c
JOIN Pessoa AS solicitante ON solicitante.id = c.solicitanteId
JOIN TipoProblema AS tipo ON tipo.id = c.tipoProblemaId
LEFT JOIN Comentario AS comentario ON comentario.chamadoId = c.id
WHERE c.titulo = 'Chamado de exemplo: acesso à rede'
ORDER BY comentario.criadoEm ASC;
