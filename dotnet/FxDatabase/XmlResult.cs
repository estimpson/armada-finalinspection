﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.FxDatabase
{
    public class XmlResult
    {
        [Key] public string Result { get; set; }
    }
}
