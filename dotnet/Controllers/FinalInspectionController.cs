using System;
using api.FxDatabase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Xml;
using System.Xml.Serialization;
using api.Models;
using Newtonsoft.Json;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FinalInspectionController : ControllerBase
    {
        private readonly ILogger<FinalInspectionController> _logger;
        private readonly FxContext _fxContext;

        public FinalInspectionController(ILogger<FinalInspectionController> logger, FxContext fxContext)
        {
            _logger = logger;
            _fxContext = fxContext;
        }

        [HttpGet("Login")]
        public ResultLogin Get([FromQuery] string user = "", [FromQuery] string password = "")
        {
            try
            {
                return _fxContext.ResultLogins.FromSqlInterpolated($@"
select
	[user] = e.operator_code
,	name = e.name
from
	dbo.employee e
where
	e.operator_code = {user}
	and e.password = {password}
").ToArray()[0];
            }
            catch (Exception ex)
            {
                Response.StatusCode = 403;
                return null;
            }
        }

        [HttpGet("Machines")]
        public IEnumerable<Machine> GetMachines()
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_Q_Machines").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<Machine>), new XmlRootAttribute("MachineList"));
            var machines = (List<Machine>)deserializer.Deserialize(
                new StringReader($"<MachineList>{result.Result}</MachineList>"));

            return machines;
        }
    }
}