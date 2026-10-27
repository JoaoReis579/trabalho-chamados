START TRANSACTION;

INSERT INTO Pessoa (nome, email, tipo, ativo)
VALUES ('Ana Exemplo', 'ana.exemplo@chamados.local', 'SOLICITANTE', TRUE)
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

INSERT INTO Pessoa (nome, email, tipo, ativo)
VALUES ('Bruno Técnico Exemplo', 'bruno.tecnico@chamados.local', 'TECNICO', TRUE)
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

INSERT INTO TipoProblema (nome, ativo)
VALUES ('Acesso à rede (exemplo)', TRUE)
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

INSERT INTO Chamado (titulo, descricao, prioridade, solicitanteId, tipoProblemaId)
SELECT 'Chamado de exemplo: acesso à rede',
       'Usuário sem acesso à rede interna do laboratório.',
       'MEDIA',
       (SELECT id FROM Pessoa WHERE email = 'ana.exemplo@chamados.local'),
       (SELECT id FROM TipoProblema WHERE nome = 'Acesso à rede (exemplo)')
WHERE NOT EXISTS (
  SELECT 1 FROM Chamado
  WHERE titulo = 'Chamado de exemplo: acesso à rede'
    AND solicitanteId = (SELECT id FROM Pessoa WHERE email = 'ana.exemplo@chamados.local')
);

INSERT INTO Comentario (texto, chamadoId, autorId)
SELECT 'Comentário inicial de exemplo.',
       (SELECT id FROM Chamado
        WHERE titulo = 'Chamado de exemplo: acesso à rede'
          AND solicitanteId = (SELECT id FROM Pessoa WHERE email = 'ana.exemplo@chamados.local')
        ORDER BY id DESC LIMIT 1),
       (SELECT id FROM Pessoa WHERE email = 'ana.exemplo@chamados.local')
WHERE NOT EXISTS (
  SELECT 1 FROM Comentario
  WHERE chamadoId = (SELECT id FROM Chamado
                     WHERE titulo = 'Chamado de exemplo: acesso à rede'
                       AND solicitanteId = (SELECT id FROM Pessoa WHERE email = 'ana.exemplo@chamados.local')
                     ORDER BY id DESC LIMIT 1)
    AND texto = 'Comentário inicial de exemplo.'
);

COMMIT;
