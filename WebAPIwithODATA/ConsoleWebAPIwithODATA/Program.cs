using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Owin.Hosting;

namespace ConsoleWebAPIwithODATA
{
	class Program
	{
		static void Main(string[] args)
		{
			const string BaseAddress = "http://localhost:9000/";

			// Start OWIN host 
			using (WebApp.Start<Startup>(url: BaseAddress))
			{
				Console.ReadLine(); 
			}
		}
	}
}
