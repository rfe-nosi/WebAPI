using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

using Model;

using WebAPIwithODATA.Models;

namespace ConsoleWebAPIwithODATA.Controllers
{
	[RoutePrefix("api")]
	public class ValuesController : ApiController
	{
		// GET api/values
		public IEnumerable<string> Get()
		{
			return new string[] { "value1", "value2" };
		}

		// GET api/values/5
		public string Get(int id)
		{
			return id.ToString();
		}

		// GET api/values/5
		[Queryable]
		[Route("anything/{id}")]
		public IQueryable<House> GetAnything(int id)
		{
			var house = new House();
			var house1 = new House();
			var glaus = new Animal { Name="Glaus", Age = id };
			var tiger = new Animal { Name="Tiger", Age = id };
			house.Animals = new List<Animal> { glaus, glaus };
			house1.Animals = new List<Animal> { tiger, tiger };
			var houses = new List<House> { house, house1 };

			return houses.AsQueryable();
		}

		// GET api/values/5
		[Queryable]
		[Route("anything/{id}/{a}")]
		public IQueryable<House> GetAnything(int id, int a)
		{
			var house = new House();
			var house1 = new House();
			var glaus = new Animal { Name = "Glaus", Age = id, Size = a };
			var tiger = new Animal { Name = "Tiger", Age = id, Size = a };
			house.Animals = new List<Animal> { glaus, glaus };
			house1.Animals = new List<Animal> { tiger, tiger };
			var houses = new List<House> { house, house1 };

			return houses.AsQueryable();
		}

		// POST api/values
		public void Post([FromBody]string value)
		{
		}

		// PUT api/values/5
		public void Put(int id, [FromBody]string value)
		{
		}

		// DELETE api/values/5
		public void Delete(int id)
		{
		}
	}
}
