import os
import sys
import time
import pkgutil
import threading
import subprocess
from pathlib import Path
from importlib import import_module
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, Response, Request ,Config
basic_items = ['steps','success_message', 'failure_message', 'info_message']

################################################################################
################################################################################

import logging 
try:
	import colorama
	from colorama import init
	init()
	from colorama import Fore, Back, Style
	COLORMEQUALIFIED = True
except ImportError as derp:
	print("[-] NO COLOR PRINTING FUNCTIONS AVAILABLE")
	COLORMEQUALIFIED = False
    
#######################################

blueprint 			= lambda text: print(Fore.BLUE + ' ' +  text + ' ' + \
	Style.RESET_ALL) if (COLORMEQUALIFIED == True) else print(text)
greenprint 			= lambda text: print(Fore.GREEN + ' ' +  text + ' ' + \
	Style.RESET_ALL) if (COLORMEQUALIFIED == True) else print(text)
redprint 			= lambda text: print(Fore.RED + ' ' +  text + ' ' + \
	Style.RESET_ALL) if (COLORMEQUALIFIED == True) else print(text)
# inline colorization for lambdas in a lambda
makered				= lambda text: Fore.RED + ' ' +  text + ' ' + \
	Style.RESET_ALL if (COLORMEQUALIFIED == True) else None
makegreen  			= lambda text: Fore.GREEN + ' ' +  text + ' ' + \
	Style.RESET_ALL if (COLORMEQUALIFIED == True) else None
makeblue  			= lambda text: Fore.BLUE + ' ' +  text + ' ' + \
	Style.RESET_ALL if (COLORMEQUALIFIED == True) else None
makeyellow 			= lambda text: Fore.YELLOW + ' ' +  text + ' ' + \
	Style.RESET_ALL if (COLORMEQUALIFIED == True) else None
yellow_bold_print 	= lambda text: print(Fore.YELLOW + Style.BRIGHT + \
	' {} '.format(text) + Style.RESET_ALL) if (COLORMEQUALIFIED == True) else print(text)

#####################################

log_file = '/tmp/logtest'
logging.basicConfig(filename=log_file, format='%(asctime)s %(message)s', filemode='w')
logger		   		= logging.getLogger()
logger.setLevel(logging.DEBUG)
debug_message		= lambda message: logger.debug(blueprint(message)) 
info_message		= lambda message: logger.info(greenprint(message)) 
warning_message 	= lambda message: logger.warning(yellow_bold_print(message)) 
error_message		= lambda message: logger.error(redprint(message)) 
critical_message 	= lambda message: logger.critical(yellow_bold_print(message))

################################################################################
##############                  Flask Stuff                    #################
################################################################################
TESTING = True
TEST_DB            = 'sqlite://'
DATABASE_HOST      = "localhost"
DATABASE           = "CommandRunner"
DATABASE_USER      = "admin"
SERVER_NAME        = "CommandRunner"
LOCAL_CACHE_FILE   = 'sqlite:///'  + DATABASE_HOST + "@" + DATABASE_USER+ "_" + DATABASE + ".db"

class Config(object):
    if TESTING == True:
        #SQLALCHEMY_DATABASE_URI = TEST_DB
        SQLALCHEMY_DATABASE_URI = LOCAL_CACHE_FILE
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        #engine = create_engine(TEST_DB ,\
        #    connect_args={"check_same_thread": False},poolclass=StaticPool)
    elif TESTING == False:
        SQLALCHEMY_DATABASE_URI = LOCAL_CACHE_FILE
        SQLALCHEMY_TRACK_MODIFICATIONS = False

try:
    pubchempy_database = Flask(__name__ )
    pubchempy_database.config.from_object(Config)
    database = SQLAlchemy(pubchempy_database)
    database.init_app(pubchempy_database)

    if TESTING == True:
        database.metadata.clear()

except Exception:
    redprint(Exception.with_traceback)

###############################################################################
# from stack overflow
#In the second case when you're just restarting the app I would write a 
#test to see if the table already exists using the reflect method:

#db.metadata.reflect(engine=engine)

#Where engine is your db connection created using create_engine(), and see 
#if your tables already exist and only define the class if the table is undefined.

class CommandDB(database.Model):
    __tablename__       = 'Command'
    __table_args__      = {'extend_existing': True}
    id                  = database.Column(database.Integer, \
                                          index=True, \
                                          primary_key = True, \
                                          unique=True, \
                                          autoincrement=True)
    command_string      = database.Column(database.String(16))
    success_message     = database.Column(database.String(32))

    def __repr__(self):
        return '{} \n '.format()

@app.route('/pybashy_backend')
def test_interface():
    return {'test_return': time.time()}

###################################################################################
# Stuff
###################################################################################
list_to_string       = lambda list_to_convert: ''.join(list_to_convert)

###################################################################################
# Database stuff
###################################################################################
class DatabaseFunctions():
    def __init__(self):
        pass
 ################################################################################
    def database_lookup(self, entity : str, id_of_record:str ):
        """
        """
        try:
            greenprint("[+] performing internal lookup")
            if search_validate(id_of_record):
                kwargs  = { id_of_record : entity}
                lookup_result  = Command.query.filter_by(**kwargs).first()
                #lookup_result  = database.Compound.query.filter_by(id_of_record = entity).first()
            else:
                print(**kwargs)
            return lookup_result
        except Exception as derp:
            print(derp)
            redprint("[-] Not in local database")
            # None if empty
            return None


    def add_to_db(thingie):
        """
        Takes SQLAchemy model Objects 
        For updating changes to Class_model.Attribute using the form:

            Class_model.Attribute = some_var 
            add_to_db(some_var)

        """
        try:
            database.session.add(thingie)
            database.session.commit
            redprint("=========Database Commit=======")
            greenprint(thingie)
            redprint("=========Database Commit=======")
        except Exception as derp:
            print(derp)
            print(makered("[-] add_to_db() FAILED"))
    ################################################################################

    def update_db():
        """
        DUH
        """
        try:
            database.session.commit()
        except Exception as derp:
            print(derp.with_traceback)
            print(makered("[-] Update_db FAILED"))

    ###############################################################################

    def dump_db():
        """
    Prints database to screen
        """
        print(makered("-------------DUMPING DATABASE------------"))
        records1 = database.session.query(Command).all()
        for each in records1:
            print (each)
        print(makered("------------END DATABASE DUMP------------"))

    ###############################################################################

###############################################################################
###############################################################################
class Command:
	def __init__(self,command: dict):
		self.command = command
		for key,value in self.command.items():
			setattr(self, key, value)
			self.__name__ = key
	
	def __repr__(self):
		print(self.__name__)



###############################################################################
###############################################################################
class CommandSet():
	'''
	Basic structure of the command set execution pool
	This is essentially the file/module loaded into a Class
		- All the stuff at the top level of the scope 
			- defs as thier name
			- variables as thier name
			- everything is considered an individual command 
			  unless it matches a keyword like "steps"
				- Those commands are turned into Command() 's 
	
		- feed it kwargs
	
		- put it in the execution pool
	
		- then feed it to the STEPPER
	'''
	#def __new__(cls, clsname, bases, clsdict):
	#	return super().__new__(cls, clsname, bases, clsdict)
	def __init__(self, kwargs):
		self.steps   	  = dict
		self.command_list = []
		#if key in basic_items or (key.startswith('function')):
		#self.command_list.append(Command(**kwargs))

	#def assign_steps(kwargs):
		#'''

		#'''
		#for key, value in kwargs:


	def run_command(self, command):
		'''

		'''
		for key, value in self.steps.items():
			if key == command:
				print(key,value)
				Command(command)

	def error_exit(self, message : str, derp):
		#error_message(message = message)
		print(derp.with_traceback)
		#sys.exit()	
	
	def add_command(self, kwargs):
		'''
This is a future method to add commands from the terminal
		'''
		self.command_list.append(Command(**kwargs))

###############################################################################
###############################################################################
class ExecutionPool():
	'''
	This is the command pool threading class, a container I guess?
	I dunno, I change things fast and loose
	Input : CommandSet()

	Operations:
		- turn "steps" into Command()
	'''
	def __init__(self):
		pool = {'test_init': Command({'test1' : ['ls -la ~/','info','pass','fail']})}
		self.script_cwd		   	= Path().absolute()
		self.script_osdir	   	= Path(__file__).parent.absolute()
		self.example  = {"ls_root" : ["ls -la /", "info", "[+] success message", "[-] failure message" ]}
		self.example2 = {"ls_etc"  : ["ls -la /etc"	,'info', "[-] failure message", "[+] success message" ] ,
		 	 			 "ls_home" : ["ls -la ~/", 'info', "[-] failure message", "[+] success message" ]}


	def error_exit(self, message : str, derp : Exception):
		error_message(message = message)
		print(derp.with_traceback)
		sys.exit()	

	def step(self, dict_of_commands : dict):
		try:
			for instruction in dict_of_commands.values():
				cmd 	= instruction[0]
				info    = instruction[1]
				success = instruction[2]
				fail 	= instruction[3]
				yellow_bold_print(info)
				self.current_command = cmd
				cmd_exec = self.exec_command(self.current_command)
				if cmd_exec.returncode == 0 :
					info_message(success)
				else:
					error_message(fail)
		except Exception as derp:
			return derp
	
	def worker_bee(self, flower , pollen = ''):
		'''
	Worker_bee() gathers up all the things to do and brings them to the stepper
	Dont run this function unless you want to run the scripts!
	
		- Flower is a CommandSet() and is Required
		
		- Pollen is the name of the function to run!
			only required if running in scripting mode
		'''
		try:
			#requesting a specific function_function
			if pollen != '':
				#filter out class stuff, we are searching for functions
				for thing in dir(flower):
					if thing.startswith('function') and thing.endswith(pollen):
						self.success_message = getattr(thing,'success_message')
						self.failure_message = getattr(thing,'failure_message')
						self.info_message	 = getattr(thing,'info_message')
						self.steps			 = getattr(thing,'steps')
						stepper = self.step(self.steps)
						if isinstance(stepper, Exception):
							self.error_exit(self.failure_message, Exception)
						else:
							print(self.success_message)
			# the user wants to run all functions in the class
			else:
				for thing in dir(flower):
					if thing.startswith('__') != True:
						#if we imported a function, assign things properly
						if thing.startswith('function'):
							print(thing)
							self.success_message = getattr(thing,'success_message')
							self.failure_message = getattr(thing,'failure_message')
							self.info_message	 = getattr(thing,'info_message')
							self.steps			 = getattr(thing,'steps')
							stepper = self.step(self.steps)
							if isinstance(stepper, Exception):
								self.error_exit(self.failure_message, Exception)
							else:
								print(self.success_message)
			# otherwise, everything is already assigned
			stepper = self.step(self.steps)
			if isinstance(stepper, Exception):
				print(stepper.error_message)
				raise stepper
			else:
				print(stepper.success_message)
		except Exception as derp:
			self.error_exit(self.failure_message, derp)

	def exec_command(self, command, blocking = True, shell_env = True):
		'''TODO: add formatting'''
		try:
			if blocking == True:
				step = subprocess.Popen(command,
										shell=shell_env,
				 						stdout=subprocess.PIPE,
				 						stderr=subprocess.PIPE)
				output, error = step.communicate()
				for output_line in output.decode().split('\n'):
					info_message(output_line)
				for error_lines in error.decode().split('\n'):
					critical_message(error_lines)
				return step
			elif blocking == False:
				# TODO: not implemented yet				
				pass
		except Exception as derp:
			yellow_bold_print("[-] Shell Command failed!")
			return derp
	
	def threader(self, thread_function, name):
		info_message("Thread {}: starting".format(name))
		thread = threading.Thread(target=thread_function, args=(1,))
		thread.start()
		info_message("Thread {}: finishing".format(name))

	def add_attributes_kwargs(self, kwargs):
		for (k, v) in kwargs.items():
			setattr(self, k, v)

###############################################################################
###############################################################################

class CommandRunner:
	'''
NARF!
Goes running after commands
	'''
	def __init__(self):#,kwargs):
		#for (k, v) in kwargs.items():
		#	setattr(self, k, v)
		pass

	def list_modules(self):
		'''
	Lists modules in command_set directory
		'''
		list_of_modules = []
		command_files_dir = os.path.dirname(__file__) + "/commandset"		
		list_of_subfiles  = pkgutil.iter_modules([command_files_dir])
		for x in list_of_subfiles:
			print(x.name)
			list_of_modules.append(x.name)
		return list_of_modules

	def get_functions(self, file_import):
		kwargs 				= {}
		kwargs_functions 	= {}
		command_pool        = {}
		#basic_items = ['steps','success_message', 'failure_message', 'info_message']
		try:
			for thing_name in dir(file_import):
				if thing_name.startswith('__') != True:
					if thing_name.startswith('function'):
						kwargs_functions[thing_name] = getattr(file_import, thing_name)
					else:
						print(thing_name)
						kwargs[thing_name] = getattr(file_import, thing_name)
					#if thing_name not in basic_items:
					#	kwargs_single_command[thing_name] = getattr(file_import, thing_name)
			#kwargs done
			if len(kwargs) > 0:
				#TODO: gotta find the right name and set it
				command_pool[file_import.__name__] = CommandSet(**kwargs)
			for function_name,function_object in kwargs_functions.items():
				new_command_set = CommandSet(**kwargs)
				setattr(new_command_set,function_name,function_object)
				command_pool[function_name] = new_command_set
			return command_pool

		except Exception as derp:
			self.error_exit('[-] CRITICAL ERROR: input file didnt validate, check your syntax maybe?', derp)

	###################################################################################
	## Dynamic imports
	###################################################################################
	def dynamic_import(self, module_to_import:str):
		'''
		Dynamically imports a module
			- used for the extensions

		Usage:
			thing = class.dynamic_import('name_of_file')
			returns a CommandSet()
		''' 
		command_files_name 	= 'pybashy.libraries.' + module_to_import
		imported_file		= import_module(command_files_name)#, package='pybashy')
		command_pool_dict = self.get_functions(imported_file)
		return command_pool_dict
###############################################################################
###############################################################################

def execute_test():
	exec_pool   = ExecutionPool()
	exec_pool.worker_bee(CommandRunner().dynamic_import('commandtest'))
	for command_name,command_set_object in exec_pool.items():
		for thing_name in dir(command_set_object):
			print(command_name)
			if thing_name.startswith('__') != True:
				yellow_bold_print(thing_name)
			
	#finished_task = new_stepper.worker_bee(new_command_set_class,)

def load_modules(extension):
	module_pool = {}
	module_loader = CommandRunner()
	if extension in module_loader.list_modules():
		module_pool[extension] = module_loader.dynamic_import(extension)
	else:
		yellow_bold_print("[-] Module not in framework : " + str(extension))
		raise SystemExit