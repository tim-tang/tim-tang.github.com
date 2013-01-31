---
layout: post
title: Ruby实现Mongo MapReduce初探
description: Ruby实现Mongo MapReduce初探
category: Ruby
keywords: ruby mongo mapreduce
tags: [Ruby, MongoDB]
location: Suzhou, China
alias: [/Ruby/2011/12/22/ruby-mongo-mapreduce]
---
MapReduce是一种计算模型，简单的说就是将大批量的工作（数据）分解（MAP）执行，然后再将结果合并成最终结果（REDUCE）。这样做的好处是可以在任务被分解后，可以通过大量机器进行并行计算，减少整个操作的时间。下面以MongoDB MapReduce为例说明:

##计算一个标签系统中每个标签出现的次数通过ruby实现:

	require 'mongo'
	class MongoMapReduce
		def generate_mr
			mongodb = init_mongo
			coll = mongodb.collection("things")
			map = "function(){
				this.tags.forEach(
				   function(z){
						emit( z , { count : 1 } );
					}
				);
			};"
			reduce = "function( key , values ){
				var total = 0;
				for ( var i=0; i<values.length; i++ )
					total += values[i].count;
				return { count : total };
			};"
			m = BSON::Code.new(map)
			r = BSON::Code.new(reduce)
			output = coll.map_reduce(m, r, { :out => "myresult" })
			puts output.stats
			mongodb.collection("myresult").find().each{|row| puts row.inspect }
			output.drop
		end
		def init_mongo
			mongodb = Mongo::Connection.new("localhost", 27017).db("test")
			#coll = mongodb.collection("things")
			#init_data coll
		end
		def init_data coll
			doc = {"_id" =>1,  "tags" => ['dog', 'cat']}
			doc2 = {"_id"=>2, "tags" => ['cat']}
			doc3 = {"_id"=>3, "tags" => ['mouse', 'cat', 'dog']}
			doc4 = {"_id"=>4, "tags" => []}
			coll.insert(doc)
			coll.insert(doc2)
			coll.insert(doc3)
			coll.insert(doc4)
			coll.find().each {|row| puts row.inspect }
		end
	end
	MongoMapReduce.new.generate_mr

##如需要运行以上代码还要安装mongo/bson/bson_ext:

	$ gem install mongo
	$ gem install bson
	$ gem install bson_ext

##从上面的代码我们可以看出map/reduce是由符合js语法的函数组成，我们可以这样理解，当你在所有需要计算的行执行完了map函数，你就得到了一组key-values对。基本key是emit中的key，values是每次emit函数的第二个参数组成的集合。

 - 这里这个emit函数是非常重要的，他的作用是将一条数据放入数据分组集合。

 - key-values变在key-value，也就是把这一个集合变成一个单一的值。这个操作就是Reduce

##我们必须了解这一机制会要求我们遵守的原则，那就是当我们书写Map函数时，emit的第二个参数形式是我们的Reduce函数的第二个参数，而Reduce函数的返回值，可能会作为新的输入参数再次执行Reduce操作，所以Reduce函数的返回值也需要和Reduce函数的第二个参数结构一致。

##当我们的key-values中的values集合过大，会被再切分成很多个小的key-values块，然后分别执行Reduce函数，再将多个块的结果组合成一个新的集合，作为Reduce函数的第二个参数，继续Reducer操作。可以预见，如果我们初始的values非常大，可能还会对第一次分块计算后组成的集合再次Reduce。

> 具体的mongodb MapReduce内容可以参考[***官方网站***][1]
  [1]: http://www.mongodb.org/display/DOCS/MapReduce#MapReduce-ShellExample2 "mapreduce"
