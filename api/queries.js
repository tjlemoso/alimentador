const getConnection = require("../config/postgres");
const promise = require("bluebird");
const options = {
  promiseLib: promise
};

const pgp = require("pg-promise")(options);
const db = pgp(getConnection());

const getAllLancamento = (req, res, next) => {
  db
    .any("SELECT * FROM lancamentos order by id")
    .then(function(data) {
      res.status(200).json({
        data: data
      });
    })
    .catch(function(err) {
      return next(err);
    });
};

const getLancamentoById = (req, res, next) => {
  var id = parseInt(req.params.id);
  db
    .one("SELECT * FROM lancamentos WHERE id = $1", id)
    .then(function(data) {
      res.status(200).json({
        data: data
      });
    })
    .catch(function(err) {
      return next(err);
    });
};


const getLancamentoByStatus = (req, res, next) => {
  db
    .one("SELECT * FROM lancamentos WHERE status = $1", req.params.status)
    .then(function(data) {
      res.status(200).json({
        data: data
      });
    })
    .catch(function(err) {
      return next(err);
    });
};

const Lancamento = (req, res, next) => {
  db
    .none(
      "INSERT INTO lancamentos(data_lancamento, tipo_lancamento, hora, minutos,quantidade_prevista,quantidade_realizada,status) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [
        req.query.data_lancamento,
        req.query.tipo_lancamento,
        parseInt(req.query.hora),
        parseInt(req.query.minutos),
        parseInt(req.query.quantidade_prevista),
        parseInt(req.query.quantidade_realizada),
        req.query.status
      ]
    )
    .then(() => {
      res.status(200).json({
        status: "success",
        message: "Lancamento inserido"
      });
    })
    .catch(err => {
      console.log(err);
      return next(err.error);
    });
};

const updateLancamento = (req, res, next) => {
  const id = parseInt(req.params.id);
  db
    .none(
      "update lancamentos set quantidade_realizada=$2,status=$3 where id=$1",
      [id,parseInt(req.query.quantidade_realizada), req.query.status]
    )
    .then(() => {
      res.status(200).json({
        status: "success",
        message: "lancamento atualizado"
      });
    })
    .catch(err => {
      console.log(err);
      return next(err.error);
    });
};

module.exports = {
  getAllLancamento: getAllLancamento,
  getLancamentoById: getLancamentoById,
  Lancamento: Lancamento,
  updateLancamento:updateLancamento,
  getLancamentoByStatus:getLancamentoByStatus
};
